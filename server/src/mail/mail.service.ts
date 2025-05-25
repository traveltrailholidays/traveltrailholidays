import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { SendMailI } from 'src/interfaces/mail.interface';
import { apiResponse, errorResponse } from 'src/dto/api-response.dto';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendMail(options: SendMailI) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });
            return apiResponse({payload: info, message: 'Email sent successfully'})
        } catch (error) {
            return errorResponse(error.message);
        }
    }
}
