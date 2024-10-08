//done


import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    // const { email, password } = request.body;

    await dbConnect();

    try {
        const {username,email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        console.log("here is the username:: " + username);
        console.log("here is the email:: " + email);
        console.log("here is the password:: " + password);

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'User already exists'
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists with this email'
                    },
                    {
                        status: 400
                    }
                )
            }
            else {
                const hashedPassword = await bcypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
                
            }



        }
        else {
            const hashedPassword = await bcypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 10);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAccpetingMessage: true,
                messages: [],
            });

            await newUser.save();

        }
        console.log("hii  in sign-up")

        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log("udhhf")
        console.log(emailResponse)

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: 'Error sending verification email'
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully'
            },
            {
                status: 201
            }
        )


    } catch (error) {
        console.error('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status: 500
            }
        )
    }
}

