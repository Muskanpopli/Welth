// import { currentUser } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { sendEmail } from "@/actions/send-email";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      const userEmail = loggedInUser?.email;
      //       const html = `
      //   <div style="font-family:sans-serif">
      //     <h2>Hello ${loggedInUser.name},</h2>
      //     <p>Your new account <strong>${loggedInUser.name}</strong> has been created with a balance of .</p>
      //   </div>
      // `;
      //       const emailResult = await sendEmail({
      //         to: userEmail,
      //         subject: "🎉 New Account Created!",
      //         html,
      //       });

      //       console.log("email result", emailResult);

      //       if (emailResult.success) {
      //         console.log("✅ Email sent successfully:", emailResult.data);
      //       } else {
      //         console.error("❌ Failed to send email:", emailResult.error);
      //       }

      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
