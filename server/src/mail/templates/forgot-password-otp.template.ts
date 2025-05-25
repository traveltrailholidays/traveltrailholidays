export const forgotPasswordOtpTemplate = (otpCode: string, expiryMinutes: number = 10) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP for Password Reset</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f9f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9f9fa; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.04); padding: 40px 20px;">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding-bottom: 30px;">
                                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                    <tr>
                                        <td style="padding-right: 12px;">
                                            <img src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg" alt="Logo" width="40" height="40" style="border-radius: 50%; display: block;" />
                                        </td>
                                        <td>
                                            <span style="font-size: 20px; font-weight: 600; color: #111827;">Travel Trail Holidays</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Title -->
                        <tr>
                            <td align="center" style="font-size: 24px; font-weight: 600; color: #111827; padding-bottom: 20px;">
                                Your Secure OTP for Password Reset
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td align="center" style="font-size: 16px; color: #4b5563; padding-bottom: 30px;">
                                We received a request to reset your password. Please use the following one-time password (OTP) to proceed. Enter this code in the browser window where you initiated the password reset.
                            </td>
                        </tr>

                        <!-- OTP Code -->
                        <tr>
                            <td align="center" style="padding-bottom: 30px;">
                                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 25px 20px; max-width: 320px; margin: 0 auto;">
                                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 2px; color: #111827;">${otpCode}</span>
                                </div>
                            </td>
                        </tr>

                        <!-- Info -->
                        <tr>
                            <td align="center" style="font-size: 14px; color: #6b7280; padding-bottom: 40px;">
                                If you did not request a password reset, please ignore this email. The code will remain valid for ${expiryMinutes} minutes and will expire automatically.
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="border-top: 1px solid #e5e7eb; padding-top: 20px;"></td>
                        </tr>

                        <!-- Tagline -->
                        <tr>
                            <td align="center" style="font-size: 15px; color: #6b7280; padding-top: 20px; padding-bottom: 20px;">
                                Travel Trail Holidays – your gateway to memorable journeys.
                            </td>
                        </tr>

                        <!-- Social Icons -->
                        <tr>
                            <td align="center" style="padding-bottom: 20px;">
                                <!-- Instagram -->
                                <a href="https://www.instagram.com" style="margin: 0 10px; text-decoration: none;" target="_blank">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill="#E1306C" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zM12 7.25A4.75 4.75 0 1 0 16.75 12 4.76 4.76 0 0 0 12 7.25zm0 7.75A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm4.88-8.13a1.13 1.13 0 1 0 1.12 1.13 1.13 1.13 0 0 0-1.12-1.13z"/>
                                    </svg>
                                </a>

                                <!-- Facebook -->
                                <a href="https://www.facebook.com" style="margin: 0 10px; text-decoration: none;" target="_blank">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill="#1877F2" d="M22 12A10 10 0 1 0 10 21.95V14.89h-2v-2.89h2V10.2c0-2 1.17-3.13 3-3.13a12.36 12.36 0 0 1 1.82.16v2H14.9c-1 0-1.33.61-1.33 1.25v1.52h2.26l-.36 2.89h-1.9v7.06A10 10 0 0 0 22 12z"/>
                                    </svg>
                                </a>

                                <!-- Twitter -->
                                <a href="https://www.twitter.com" style="margin: 0 10px; text-decoration: none;" target="_blank">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill="#1DA1F2" d="M22.46 6.11a8.56 8.56 0 0 1-2.46.67 4.28 4.28 0 0 0 1.88-2.37 8.49 8.49 0 0 1-2.7 1.03 4.24 4.24 0 0 0-7.27 3.86A12.02 12.02 0 0 1 3.11 4.92a4.25 4.25 0 0 0 1.31 5.66 4.18 4.18 0 0 1-1.92-.53v.05a4.25 4.25 0 0 0 3.4 4.17 4.28 4.28 0 0 1-1.91.07 4.25 4.25 0 0 0 4 2.97A8.5 8.5 0 0 1 2 19.54 12 12 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.35-.02-.53a8.37 8.37 0 0 0 2.05-2.12z"/>
                                    </svg>
                                </a>

                                <!-- LinkedIn -->
                                <a href="https://www.linkedin.com" style="margin: 0 10px; text-decoration: none;" target="_blank">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill="#0077B5" d="M4.98 3.5a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96zM3 8.98h3.96v11.52H3V8.98zM9.03 8.98h3.8v1.58h.05a4.17 4.17 0 0 1 3.75-2.07c4.01 0 4.75 2.63 4.75 6.05v6.04h-3.96v-5.35c0-1.28-.03-2.94-1.79-2.94-1.8 0-2.07 1.4-2.07 2.85v5.44H9.03V8.98z"/>
                                    </svg>
                                </a>
                            </td>
                        </tr>

                        <!-- Copyright -->
                        <tr>
                            <td align="center" style="font-size: 12px; color: #9ca3af;">
                                &copy; ${new Date().getFullYear()} Travel Trail Holidays. All rights reserved.
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};
