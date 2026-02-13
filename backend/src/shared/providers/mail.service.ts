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

  async sendVerificationEmail(email: string, verifyLink: string, userName: string) {
    try {
      await this.resend.emails.send({
        from: 'Flowly <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your email - Flowly',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello, ${userName}</h2>
            <p>Welcome to Flowly! Please confirm your email address to activate your account.</p>
            <p>Click the button below to verify your email. This link expires in 24 hours.</p>
            <a href="${verifyLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Verify Email</a>
            <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new AppError("Failed to send verification email");
    }
  }

  async sendInviteEmail(email: string, inviteLink: string, companyName: string, inviterName: string) {
    try {
      await this.resend.emails.send({
        from: 'Flowly <onboarding@resend.dev>',
        to: email,
        subject: `You've been invited to join ${companyName} on Flowly`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="text-align: center; padding: 20px 0;">
               <h2 style="color: #6366f1;">Flowly</h2>
            </div>
            <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 24px;">
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px; line-height: 1.5;">
                    <strong>${inviterName}</strong> has invited you to join the <strong>${companyName}</strong> workspace on Flowly.
                </p>
                <p style="font-size: 16px; line-height: 1.5;">Collaborate with your team, manage tasks, and track projects in one place.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${inviteLink}" style="background-color: #09090b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Join ${companyName}</a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Or copy and paste this URL into your browser:</p>
                <p style="color: #666; font-size: 12px; word-break: break-all;">${inviteLink}</p>
            </div>
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                If you were not expecting this invitation, you can ignore this email.
            </p>
          </div>
        `
      });
    } catch (error) {
      console.error("Failed to send invite email:", error);
      throw new AppError("Failed to send invitation email");
    }
  }
}