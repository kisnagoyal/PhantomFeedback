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

// src/helpers/sendVerificationEmail.ts

import { generateVerificationEmailHtml } from '../emails/VerificationEmailTemplate';  // Correct path
import sgMail from '@sendgrid/mail';
import { ApiResponse } from "@/types/ApiResponse";

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key');

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        
        // Generate the HTML content for the email
        const emailHtml = generateVerificationEmailHtml(username, verifyCode);
        
        // Create the message to send via SendGrid
        const msg = {
            to: email,
            from: 'phantom2Feedback@gmail.com',  // Ensure this is a verified sender email in SendGrid
            subject: 'PhantomFeedback | Verify your email',
            html: emailHtml,  // Pass the generated HTML string
        };
        
        // Send the email via SendGrid
        await sgMail.send(msg);
        console.log("hiii...dhd")
        console.log("Email sent successfully", email);
        return {
            success: true,
            message: 'Verification email sent',
        };
    } catch (emailError) {
        console.error('Error sending verification email', emailError);
        return {
            success: false,
            message: 'Message not sent',
        };
    }
}
