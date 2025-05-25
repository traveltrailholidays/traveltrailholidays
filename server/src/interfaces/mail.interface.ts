import * as nodemailer from 'nodemailer';

export interface SendMailI {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: NonNullable<nodemailer.SendMailOptions['attachments']>;
}
