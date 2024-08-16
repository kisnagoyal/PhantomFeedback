//done tick

"use client"
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
// import { A } from '@/types/apiResponse';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            console.log("hii..1")
            
            const response = await axios.post(`/api/verify-code`, {
                
                username: params.username,
                code: data.code
            })
            
            
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace("/sign-in")
            setIsSubmitting(false)
        } catch (error) {
            console.log("hii..2")
            // console.error("Error in sign up of user", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: "Singup failed",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">

            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Verify your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                    </>
                                ) : ("Verify")
                            }
                        </Button>
                    </form>
                </Form>

            </div>
        </div>
    )
}

export default VerifyAccount