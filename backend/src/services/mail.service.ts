import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env.js";

const from = env.SMTP_FROM || "OCG Website <no-reply@example.org>";

function transport(): Transporter | null {
  if (!env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
  });
}

export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> {
  const mailer = transport();
  if (!mailer) {
    if (!env.isProduction) {
      console.info(`[mail disabled] To: ${options.to}; Subject: ${options.subject}`);
    }
    return false;
  }
  try {
    await mailer.sendMail({ from, ...options });
    return true;
  } catch (error) {
    console.error("Outbound mail delivery failed", error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  return sendMail({
    to,
    subject: "Reset your OCG CMS password",
    text: `A password reset was requested for your OCG CMS account.\n\nOpen this link to choose a new password:\n${resetUrl}\n\nThe link expires in ${env.PASSWORD_RESET_TTL_MINUTES} minutes. If you did not request it, ignore this email.`,
  });
}

export async function sendNewUserEmail(to: string, temporaryPassword: string, appUrl: string): Promise<boolean> {
  return sendMail({
    to,
    subject: "Your OCG CMS account",
    text: `An OCG CMS account has been created for you.\n\nSign in at ${appUrl}\nEmail: ${to}\nTemporary password: ${temporaryPassword}\n\nYou must change this password after signing in.`,
  });
}