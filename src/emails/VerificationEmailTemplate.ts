// src/emails/VerificationEmailTemplate.ts
export function generateVerificationEmailHtml(username: string, otp: string): string {
    return `
        <html>
            <body>
                <h1>Verify Your Email</h1>
                <p>Hello ${username},</p>
                <p>Your verification code is: <strong>${otp}</strong></p>
                <p>Use this code to complete your sign-up process.</p>
            </body>
        </html>
    `;
}
