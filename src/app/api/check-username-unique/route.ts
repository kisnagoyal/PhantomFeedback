// done tick
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        // Validate with zod
        const result = UsernameQuerySchema.safeParse({ username });

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return NextResponse.json({
                success: false,
                message: usernameError.length > 0 ? 
                usernameError.join(", "): "Invalid query parameter",
            }, { status: 400 });
        }

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return NextResponse.json({
                success: false,
                message: "Username already exists",
            }, { status: 409 });
        }

        return NextResponse.json({
            success: true,
            message: "Username is unique",
        }, { status: 200 });

    } catch (error) {
        console.error("Error in check-username-unique:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}
