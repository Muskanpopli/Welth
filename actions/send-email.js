"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Finance App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// import { Resend } from "resend";

// export async function sendEmail({ to, subject, react }) {
//   const resend = new Resend(process.env.RESEND_API_KEY || "");

//   try {
//     const data = await resend.emails.send({
//       from: "Finance App <onboarding@resend.dev>",
//       to,
//       subject,
//       react,
//     });

//     return { success: true, data };
//   } catch (error) {
//     console.error("Failed to send email:", error);
//     return { success: false, error };
//   }
// }
