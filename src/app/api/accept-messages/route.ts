// //done

// import { getServerSession } from "next-auth";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { User } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";

// export async function POST(request: Request) {
//     console.log("k1...")
//     await dbConnect();
    

//     const session = await getServerSession(authOptions)
//     const user: User= session?.user as User
//     console.log("user")
//     console.log(user._id)

//     if (!session || !session.user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "not authenticated"
//             },
//             {
//                 status: 401
//             }
//         );
//     }

//     const userId = user._id;
//     const {acceptedMessages} = await request.json();

//     try {
//         const updatedUser = await UserModel.findByIdAndUpdate(
//             userId,
//             {acceptedMessages},
//             {new: !user.isAcceptingMessage}
//         );
//         if(!updatedUser) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "user not found"
//                 },
//                 {
//                     status: 404
//                 }
//             );
//         }
//         return Response.json(
//             {
//                 success: true,
//                 message: 'changed',
//                 updatedUser
//             },
//             {
//                 status: 200
//             }
//         );
        
        
//     } 
//     catch (error) {
//         console.error("failed to update user status to accpet messages",error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "failed to update user status to accpet messages"
//             },
//             {
//                 status: 500
//             }
//         );
//     }

   

    
// }

// export async function GET(request: Request) {
//     await dbConnect();
//     console.log("k1")
//     const session = await getServerSession(authOptions)
//     const user : User = session?.user as User

//     if (!session || !session.user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "not authenticated"
//             },
//             {
//                 status: 401
//             }
//         );
//     }

//     const userId = user._id;

//     try { 
//         const foundUser = await UserModel.findById(userId);
//         if(!foundUser) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "user not found"
//                 },
//                 {
//                     status: 404
//                 }
//             );
//         }
//         return Response.json(
//             {
//                 success: true,
//                 message: "user status updated to accept messages",
//                 isAcceptingMessages: foundUser.isAcceptingMessage,
//                 status: 200
//             }
//         );
        
        
//     } 
//     catch (error) {
//         console.error("failed to update user status to accpet messages",error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "failed to update user status to accpet messages"
//             },
//             {
//                 status: 500
//             }
//         );
//     }
    
// }
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: "Not authenticated" }),
            { status: 401 }
        );
    }

    const user: User = session.user as User;
    const userId = user._id;

    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Changed",
                updatedUser,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user status to accept messages", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to update user status" }),
            { status: 500 }
        );
    }
}


export async function GET(request: Request) {
    await dbConnect();
    console.log("k1...");
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not authenticated",
            }),
            { status: 401 }
        );
    }

    const user: User = session.user as User;
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                { status: 404 }
            );
        }
        return new Response(
            JSON.stringify({
                success: true,
                message: "User found",
                isAcceptingMessages: foundUser.isAcceptingMessage,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to fetch user status", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch user status",
            }),
            { status: 500 }
        );
    }
}
