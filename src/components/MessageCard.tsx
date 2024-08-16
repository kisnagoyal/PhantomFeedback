"use Client"
import axios from "axios"
import { Button } from "./ui/button"
import dayjs from "dayjs";
import { X } from "lucide-react"
import { Message } from "@/models/User"
import { useToast } from "./ui/use-toast"
import { ApiResponse } from "@/types/ApiResponse"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void,
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const { toast } = useToast()


    async function handleDeleteConfirm() {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title: response.data.message
            })
            const id: string = message._id as string;
            onMessageDelete(id)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete the message.',
                variant: 'destructive'
            });
        }

    }

    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive'>
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>

        </Card>
    )
}

export default MessageCard