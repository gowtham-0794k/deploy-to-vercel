// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_SERVER_HOST,
//   port: Number(process.env.EMAIL_SERVER_PORT),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_SERVER_USER,
//     pass: process.env.EMAIL_SERVER_PASSWORD,
//   },
// });

// export async function sendEmail(to: string, subject: string, html: string) {
//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: to,
//     subject,
//     html,
//   });
// }

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.ZEPTO_EMAIL_HOST,
  port: parseInt(process.env.ZEPTO_EMAIL_PORT || "587", 10),
  secure: process.env.ZEPTO_EMAIL_SECURE === "true",
  auth: {
    user: process.env.ZEPTO_EMAIL_USER, // ZeptoMail SMTP User
    pass: process.env.ZEPTO_EMAIL_PASS, // ZeptoMail SMTP Password
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.ZEPTO_EMAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error sending email", {
      to,
      error: errorMessage,
      stack: error.stack || "No stack trace available",
    });
    throw new Error(`Failed to send email to ${to}: ${errorMessage}`);
  }
}
