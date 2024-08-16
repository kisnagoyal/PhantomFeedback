
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();


    const session = await getServerSession(authOptions)
    const user: User= session?.user as User
    
    if (!session || !session.user) {
        console.log("get-message")
        
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            {
                status: 401
            }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        
        
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId // _id ?
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    'messages.createdAt': -1


                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "userId",
                    as: "messages"
                }
            }
        ]);
        const data = await UserModel.findById(userId);
        console.log("data", data)
        // console.log( "user", user)
        if(!user || user.length === 0) {
            console.log("get-message error")
        
            return Response.json(
                {
                    success: false,
                    message: "No Message to Show"
                },
                {
                    status: 404
                }
            );
        }
        if(!data || data.messages.length === 0) {
            console.log("empty data")
        }
        else {
        return Response.json(
            
            {
                success: true,
                messages: data.messages,
            },
            {
                status: 200
            }
        );

    }


    }
    catch (error) {
        console.error("failed to retrieve user messages", error);
        return Response.json(
            {
                success: false,
                message: "failed to retrieve user messages"
            },
            {
                status: 500
            }
        );
    }
}