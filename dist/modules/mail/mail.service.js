"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    from;
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
        }
        else {
            this.logger.warn('SMTP not configured — emails will be logged to console');
        }
    }
    async send(to, subject, html) {
        if (!this.transporter) {
            this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject} | Body: ${html}`);
            return;
        }
        try {
            await this.transporter.sendMail({ from: this.from, to, subject, html });
            this.logger.log(`Email sent to ${to}: ${subject}`);
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${to}: ${err}`);
        }
    }
    sendVerificationEmail(to, token) {
        const url = `${process.env.FRONTEND_URL || 'https://somosflowpass.com'}/auth/verify-email?token=${token}`;
        return this.send(to, 'Verifica tu correo — FlowPass', `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#0F1729;">Bienvenido a FlowPass 🎉</h2>
        <p style="color:#555;">Gracias por registrarte. Para empezar a disfrutar de todos los beneficios, confirmá tu correo electrónico.</p>
        <a href="${url}" style="display:inline-block;background:#FFB800;color:#000;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;margin:16px 0;">
          Verificar correo
        </a>
        <p style="color:#999;font-size:12px;">O copiá este link en tu navegador:<br/>${url}</p>
      </div>`);
    }
    sendResetPasswordEmail(to, token) {
        const url = `${process.env.FRONTEND_URL || 'https://somosflowpass.com'}/auth/reset-password?token=${token}`;
        return this.send(to, 'Restablecé tu contraseña — FlowPass', `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#0F1729;">Restablecer contraseña</h2>
        <p style="color:#555;">Recibimos una solicitud para restablecer tu contraseña. Hacé click en el siguiente botón:</p>
        <a href="${url}" style="display:inline-block;background:#FFB800;color:#000;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;margin:16px 0;">
          Restablecer contraseña
        </a>
        <p style="color:#999;font-size:12px;">Si no solicitaste esto, ignorá este mensaje.<br/>Link: ${url}</p>
      </div>`);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map