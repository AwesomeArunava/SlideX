import { Resend } from "resend";
import dotenv from "dotenv"


dotenv.config()
const API_KEY = process.env.RESEND_API_KEY
const resend = new Resend(API_KEY); // Replace with your actual API key

const sendVerificationEmail = async (email, token) => {
    console.log("send verification email.")
  try {
    const { data, error } = await resend.emails.send({
      from: "SlideX <onboarding@resend.dev>", // Use your verified domain
      to: [email],
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${token}" target="_blank">
          Verify Email
        </a>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};

export default sendVerificationEmail;
