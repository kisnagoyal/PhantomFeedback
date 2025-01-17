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

import { sendgrid } from "@/lib/resend"; // Import your SendGrid setup
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        console.log(email);

        // Send email using SendGrid
        await sendgrid.send({
            to: email, // Recipient's email
            from: 'your-email@example.com', // Replace with your verified SendGrid sender email
            subject: 'PhantomFeedback | Verify your email',
            html: ReactDOMServer.renderToStaticMarkup(VerificationEmail({ username, otp: verifyCode })), // Send the email body as HTML
        });

        console.log("success", email);

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

