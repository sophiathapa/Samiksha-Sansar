import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: `"Book Club" <sophia.magar33@gmail.com>`,
    to,
    subject,
    text,
    html,
  });
};

export { sendEmail };
