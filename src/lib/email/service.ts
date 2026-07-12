import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface EmailService {
  send: (params: SendEmailParams) => Promise<{ error: string | null }>;
}

function createGmailTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

const gmailService: EmailService = {
  async send({ to, subject, html }) {
    try {
      const transporter = createGmailTransport();
      await transporter.sendMail({
        from: `Synora <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      return { error: null };
    } catch (err) {
      console.error("EMAIL_SEND_ERROR:", err);
      return { error: err instanceof Error ? err.message : "Unknown email error" };
    }
  },
};

export const emailService: EmailService = gmailService;