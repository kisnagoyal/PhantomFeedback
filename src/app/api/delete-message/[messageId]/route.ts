import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";



export async function DELETE(request:Request,{params}:{params:{messageId:string}}){
    const messageId=params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    try {
        const updateResult= await UserModel.updateOne(
            { _id:user._id},
        {
            $pull:{
                messages:{
                    _id:messageId 
                }
            }
        })

        if(updateResult.modifiedCount==0){
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Message deleted Successfully"
        }, { status: 201 })
    } catch (error) {
        console.log("Error in delete message route",error);
        
        return Response.json({
            success: false,
            message: "Error in deleting the message"
        }, { status: 500 })
    }
}