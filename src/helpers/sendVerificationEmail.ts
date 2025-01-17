// //done

// import {resend} from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import {ApiResponse} from "@/types/ApiResponse";



// export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
//     try {
//         console.log(email)
//         await resend.emails.send({
//             from: 'onboarding@resend.dev', //prblm can be in this line
//             to: [email], 
//             subject: 'PhantomFeedback | Verify your email',
//             react: VerificationEmail({username, otp: verifyCode})
//         });
//         console.log("success", email)
//         return {

//             success: true,
//             message: 'Verification email sent'
//         };
//     } catch (emailError) {
//         console.error('Error sending verification email')
//         return {
//             success: false,
//             message: 'message not sent'
//         };
//     }
// }


const sgMail = require('@sendgrid/mail');
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// Set SendGrid API Key (Ensure it's stored securely in environment variables)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key');

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        console.log(email);

        // Render the email content using VerificationEmail
        const emailHtml = VerificationEmail({ username, otp: verifyCode });

        // Create the message to send via SendGrid
        const msg = {
            to: email,
            from: 'phantom2Feedback@gmail.com',  // Replace with your verified sender email
            subject: 'PhantomFeedback | Verify your email',
            html: emailHtml,  // Email content rendered by VerificationEmail
        };

        // Send the email via SendGrid
        await sgMail.send(msg);

        console.log("success", email);
        return {
            success: true,
            message: 'Verification email sent'
        };
    } catch (emailError) {
        console.error('Error sending verification email', emailError);
        return {
            success: false,
            message: 'Message not sent'
        };
    }
}
