
// import { getServerSession } from "next-auth";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { User } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import mongoose from "mongoose";
// import crypto from "@/lib/crypto";

// export async function GET(request: Request) {
//     await dbConnect();


//     const session = await getServerSession(authOptions)
//     const user: User= session?.user as User

//     if (!session || !session.user) {
//         console.log("get-message")

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

//     const userId = new mongoose.Types.ObjectId(user._id);

//     try {


//         const user = await UserModel.aggregate([
//             {
//                 $match: {
//                     _id: userId // _id ?
//                 }
//             },
//             {
//                 $unwind: "$messages"
//             },
//             {
//                 $sort: {
//                     'messages.createdAt': -1


//                 }
//             },
//             {
//                 $group: {
//                     _id: "$_id",
//                     messages: {

//                         $push: "$messages"
//                     }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "messages",
//                     localField: "_id",
//                     foreignField: "userId",
//                     as: "messages"
//                 }
//             }
//         ]);
//         const data = await UserModel.findById(userId);
//         // console.log("data", data)

//         // console.log( "user", user)
//         if(!user || user.length === 0) {
//             console.log("get-message error")

//             return Response.json(
//                 {
//                     success: false,
//                     message: "No Message to Show"
//                 },
//                 {
//                     status: 404
//                 }
//             );
//         }
//         if(!data || data.messages.length === 0) {
//             console.log("empty data")
//         }
//         else {



//         return Response.json(

//             {
//                 success: true,
//                 messages: data.messages,
//                 // messages: crypto.m(data.messages,false);
//             },
//             {
//                 status: 200
//             }
//         );

//     }


//     }
//     catch (error) {
//         console.error("failed to retrieve user messages", error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "failed to retrieve user messages"
//             },
//             {
//                 status: 500
//             }
//         );
//     }
// }

// import { getServerSession } from "next-auth";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { User } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import mongoose from "mongoose";
// import crypto from "@/lib/crypto"; // Ensure this has a decrypt function
// export async function GET(request: Request) {
//     await dbConnect();

//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//         console.log("get-message: not authenticated");
//         return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
//     }

//     const userId = new mongoose.Types.ObjectId(session.user._id);

//     try {
//         // Fetch user data (including messages)
//         const userData = await UserModel.findById(userId);

//         if (!userData || !userData.messages || userData.messages.length === 0) {
//             console.log("No messages found");
//             return Response.json({ success: false, message: "No messages to show" }, { status: 404 });
//         }
//         const testDecrypted = crypto.m(userData.messages[userData.messages.length - 1].content, false);
//         console.log(userData.messages[userData.messages.length - 1].content);
//         console.log("Test Decrypted:", testDecrypted);


//         const decryptedMessages = userData.messages.map((msg, index: number) => {
//             if (!msg.content) {
//                 console.warn(`Message ${index + 1} has no content`);
//                 return msg;  // Skip message with no content
//             }
            
//             // Log type of content and apply decryption
//             console.log(`Message ${index + 1} content type:`, typeof msg.content);
            
//             // Decrypt the message content
//             const decryptedContent = crypto.m(msg.content, false); // Assuming msg.content is the encrypted text
            
//             // Log the decrypted content
//             console.log(`Decrypted ${index + 1}:`, decryptedContent);
            
//             return {
//                 ...msg,
//                 content: decryptedContent  // Replace the encrypted content with the decrypted one
//             };
//         });
        
//         return Response.json(
//             {
//                 success: true,
//                 messages: decryptedMessages,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Failed to retrieve user messages:", error);
//         return Response.json({ success: false, message: "Failed to retrieve user messages" }, { status: 500 });
//     }
// }





import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import crypto from "@/lib/crypto";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        console.log("get-message: not authenticated");
        return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userData = await UserModel.findById(userId);

        if (!userData || !userData.messages || userData.messages.length === 0) {
            console.log("No messages found");
            return Response.json({ success: false, message: "No messages to show" }, { status: 404 });
        }
        // Decrypt each message's content
        const decryptedMessages = userData.messages.map((msg: any, index: number) => {
            console.log("id ----------------------------------------------------------" + msg._id);
            if (!msg.content) {
                console.warn(`Message ${index + 1} has no content`);
                return msg;
            }

            // Log type of content and apply decryption
            console.log(`Message ${index + 1} content type:`, typeof msg.content);

            // Decrypt the message content
            const decryptedContent = crypto.m(msg.content, false); // Decrypt message content


            return {
                ...msg,
                content: decryptedContent,
                _id: msg._id
            };
            
        });

        console.log(decryptedMessages[0]._id)

        return Response.json(

            {
                success: true,
                messages: decryptedMessages,  
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to retrieve user messages:", error);
        return Response.json({ success: false, message: "Failed to retrieve user messages" }, { status: 500 });
    }
}
