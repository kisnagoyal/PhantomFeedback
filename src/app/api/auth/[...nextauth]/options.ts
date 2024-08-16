//donee

// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';  // if I have to use log in via facebook, google, etc. I will have to import the respective provider here and syntax will be for let's say facebook: import FacebookProvider from 'next-auth/providers/facebook';

// import bcrypt from 'bcryptjs'; // for password hashing and comparing password with hashed password in database 
// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/models/User';

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             id: "credentials",
//             name: "Credentials",

//             credentials: {
//                 email: { label: "email", type: "text" },
//                 password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials: any): Promise<any> {
//                 await dbConnect();
//                 try {
//                     const user = await UserModel.findOne({
//                         $or: [
//                             { email: credentials.email },
//                             { username: credentials.email }

//                         ]
//                     });
//                     if (!user) {
//                         throw new Error("No user found with this email/username");
//                     }
//                     if (!user.isVerified) {
//                         throw new Error("Please verify your account before login")
//                     }

//                     const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

//                     if (isPasswordCorrect) {
//                         return user  //main step
//                     }
//                     else {
//                         throw new Error('Incorrect Password')
//                     }

//                 }
//                 catch (error) {
//                     throw new Error("Error in authorizing user");
//                 }
//             }
//         })
//     ],

//     //callbacks
//     callbacks: {
//         async jwt({ token, user }) {   //user is returned in  above function
//             if (user) {
//                 token._id = user._id?.toString()
//                 token.isVerified = user.isVerified
//                 token.isAcceptingMessage = user.isAcceptingMessage
//                 token.username = user.username

//             }
//             return token
//         },

//         async session({ session, token }) {  //session is returned in above function and token is returned in below function 
//             if (token) {
//                 session.user._id = token._id
//                 session.user.isVerified = token.isVerified
//                 session.user.isAcceptingMessage = token.isAcceptingMessage
//                 session.user.username = token.username


//             }
//             return session
//         },



//     },

//     // pages
//     pages: {
//         signIn: '/sign-in'   //now next will handle everything from routes etc

//     },
//     session: {
//         strategy: "jwt"
//     },
//     secret: process.env.NEXTAUTH_SECRET,

// }


import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // id: "credentials",
            name: "Credentials", // capital c ?
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    
                    if (!user) {
                        throw new Error("no user found with this email address")
                    }
                    if (!user.isVerified) {
                        throw new Error("please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("password is incorrect")
                    }
                } catch (err: any) {
                    throw new Error("Please Sign up",err)
                }
            }

        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;

            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        }
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}