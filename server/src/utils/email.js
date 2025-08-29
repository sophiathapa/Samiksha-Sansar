import nodemailer from "nodemailer"

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: "sophia.magar33@gmail.com",
    pass: "dxal iikr ekhk yxcg",
  },
});

const sendEmail = async({to,subject,text,html})=>{
  const info = await transporter.sendMail({
    from: `"Book Club" <sophia.magar33@gmail.com>`,
    to,
    subject,
    text,
    html
  });
}

export { sendEmail}
