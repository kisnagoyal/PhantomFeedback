//done

import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from "@/types/ApiResponse";



export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        console.log(email)
        await resend.emails.send({
            from: 'onboarding@resend.dev', //prblm can be in this line
            to: [email], 
            subject: 'PhantomFeedback | Verify your email',
            react: VerificationEmail({username, otp: verifyCode})
        });
        console.log("success", email)
        return {

            success: true,
            message: 'Verification email sent'
        };
    } catch (emailError) {
        console.error('Error sending verification email')
        return {
            success: false,
            message: 'message not sent'
        };
    }
}

