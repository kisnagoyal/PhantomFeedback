//done tickk
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export async function POST(request: Request){
    await dbConnect();

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "user not found..."
                },
                {
                    status: 404
                }
            );
        }

        //is user accepting message
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "user not accepting messages"
                },
                {
                    status: 400
                }
            );
        }
        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "message sent"
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("message not sent", error)
        return Response.json(
            {
                success: false,
                message: "message not sent"
            },
            {
                status: 500
            }
        );

    }

}
