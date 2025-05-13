"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./send-email";
import EmailTemplate from "@/emails/template";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Serialize accounts before sending to client
    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}

// export async function createAccount(data) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Get request data for ArcJet
//     const req = await request();

//     // Check rate limit
//     const decision = await aj.protect(req, {
//       userId,
//       requested: 1, // Specify how many tokens to consume
//     });

//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         const { remaining, reset } = decision.reason;
//         console.error({
//           code: "RATE_LIMIT_EXCEEDED",
//           details: {
//             remaining,
//             resetInSeconds: reset,
//           },
//         });

//         throw new Error("Too many requests. Please try again later.");
//       }

//       throw new Error("Request blocked");
//     }

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Convert balance to float before saving
//     const balanceFloat = parseFloat(data.balance);
//     if (isNaN(balanceFloat)) {
//       throw new Error("Invalid balance amount");
//     }

//     // Check if this is the user's first account
//     const existingAccounts = await db.account.findMany({
//       where: { userId: user.id },
//     });

//     // If it's the first account, make it default regardless of user input
//     // If not, use the user's preference
//     const shouldBeDefault =
//       existingAccounts.length === 0 ? true : data.isDefault;

//     // If this account should be default, unset other default accounts
//     if (shouldBeDefault) {
//       await db.account.updateMany({
//         where: { userId: user.id, isDefault: true },
//         data: { isDefault: false },
//       });
//     }

//     // Create new account
//     const account = await db.account.create({
//       data: {
//         ...data,
//         balance: balanceFloat,
//         userId: user.id,
//         isDefault: shouldBeDefault, // Override the isDefault based on our logic
//       },
//     });

//     // ✅ Send email after account creation
//     await sendEmail({
//       to: user.email,
//       subject: "🎉 New Account Created!",
//       react: EmailTemplate({
//         userName: user.name,
//         type: "account-created",
//         data: {
//           message: `Hi ${user.name}, your new account "${data.name}" has been successfully created with a starting balance of $${balanceFloat.toFixed(2)}.`,
//         },
//       }),
//     });

//     // Serialize the account before returning
//     const serializedAccount = serializeTransaction(account);

//     revalidatePath("/dashboard");
//     return { success: true, data: serializedAccount };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const req = await request();
    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error("RATE_LIMIT_EXCEEDED", {
          remaining,
          resetInSeconds: reset,
        });
        throw new Error("Too many requests. Please try again later.");
      }
      console.error("ArcJet decision denied:", decision.reason);
      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      console.error("User not found for userId:", userId);
      throw new Error("User not found");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      console.error("Invalid balance input:", data.balance);
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    // ✅ EMAIL SENDING LOGIC

    //     const html = `
    //   <div style="font-family:sans-serif">
    //     <h2>Hello ${user.name},</h2>
    //     <p>Your new account <strong>${data.name}</strong> has been created with a balance of .</p>
    //   </div>
    // `;

    //     const emailResult = await sendEmail({
    //       to: user.email,
    //       subject: "🎉 New Account Created!",
    //       html,
    //     });

    //     if (emailResult.success) {
    //       console.log("✅ Email sent successfully:", emailResult.data);
    //     } else {
    //       console.error("❌ Failed to send email:", emailResult.error);
    //     }

    const serializedAccount = serializeTransaction(account);
    revalidatePath("/dashboard");

    return { success: true, data: serializedAccount };
  } catch (error) {
    console.error("❌ createAccount error:", error.message);
    throw new Error(error.message);
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
