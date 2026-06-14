import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private from: string;

  constructor() {
    this.from = process.env.SMTP_FROM || 'noreply@somosflowpass.com';
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Mail service ready (${host}:${port})`);
    } else {
      this.logger.warn('SMTP not configured — emails will be logged to console');
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject} | Body: ${html}`);
      return;
    }
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
    }
  }

  sendVerificationEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL || 'https://somosflowpass.com'}/auth/verify-email?token=${token}`;
    return this.send(
      to,
      'Verifica tu correo — FlowPass',
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#0F1729;">Bienvenido a FlowPass 🎉</h2>
        <p style="color:#555;">Gracias por registrarte. Para empezar a disfrutar de todos los beneficios, confirmá tu correo electrónico.</p>
        <a href="${url}" style="display:inline-block;background:#FFB800;color:#000;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;margin:16px 0;">
          Verificar correo
        </a>
        <p style="color:#999;font-size:12px;">O copiá este link en tu navegador:<br/>${url}</p>
      </div>`,
    );
  }

  sendResetPasswordEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL || 'https://somosflowpass.com'}/auth/reset-password?token=${token}`;
    return this.send(
      to,
      'Restablecé tu contraseña — FlowPass',
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#0F1729;">Restablecer contraseña</h2>
        <p style="color:#555;">Recibimos una solicitud para restablecer tu contraseña. Hacé click en el siguiente botón:</p>
        <a href="${url}" style="display:inline-block;background:#FFB800;color:#000;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;margin:16px 0;">
          Restablecer contraseña
        </a>
        <p style="color:#999;font-size:12px;">Si no solicitaste esto, ignorá este mensaje.<br/>Link: ${url}</p>
      </div>`,
    );
  }
}
