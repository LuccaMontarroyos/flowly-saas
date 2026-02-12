import { Resend } from 'resend';
import { AppError } from '../../shared/errors/AppError';

export class MailService {
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing via .env");
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendForgotPasswordEmail(email: string, resetLink: string, userName: string) {
    try {
      await this.resend.emails.send({
        from: 'Flowly <onboarding@resend.dev>', // Use seu domínio verificado em prod
        to: email,
        subject: 'Reset your password - Flowly',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello, ${userName}</h2>
            <p>We received a request to reset your password for your Flowly account.</p>
            <p>Click the button below to reset it. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Reset Password</a>
            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new AppError("Failed to send email provider"); 
    }
  }
}