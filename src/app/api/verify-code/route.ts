// //done tick

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 400
                }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (!isCodeNotExpired) {
            return NextResponse.json(
                {
                    success: false,
                    message: "code expired"
                },
                {
                    status: 400
                }
            );
        }

        if (!isCodeValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "invalid code"
                },
                {
                    status: 400
                }
            );
        }

        user.isVerified = true;
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "user verified"
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error verifying user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "error verifying user"
            },
            {
                status: 500
            }
        );
    }
}
