import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (to: string, code: string) => {
    const mailOptions = {
        from: `"No Reply" <${process.env.SMTP_USER}>`,
        to,
        subject: "Email Verification Code",
        text: `Your verification code is: ${code}`,
        html: `<h3>Email Verification</h3>
           <p>Your verification code is:</p>
           <h2>${code}</h2>
           <p>It will expire soon. Please verify your account.</p>`,
    };

    await transporter.sendMail(mailOptions);
};
