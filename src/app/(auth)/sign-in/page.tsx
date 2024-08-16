"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';


function SignIn() {

    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.email,
            password: data.password
        })
        console.log(result);

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login Failed',
                    description: 'Incorrect username or password',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        }
        if (result?.url) {
            router.replace("/dashboard")
        }
        setIsSubmitting(false);
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">

            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Join PhantomFeedback
                    </h1>
                    <p className="mb-4">Sign in to start your anonymous adventure</p>
                </div>
                <Form{...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password"
                                            {...field}

                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
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
                                ) : ("Sign in")
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;


