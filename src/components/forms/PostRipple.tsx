"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import { usePathname, useRouter } from "next/navigation"
import { RippleValidationSchema } from "@/lib/validations/ripple"
import { createRipple } from "@/lib/actions/ripple.actions"
import { RotatingLines } from 'react-loader-spinner'
import { useState } from "react"
import { useOrganization } from "@clerk/nextjs"
// import { UpdateUser } from "@/lib/actions/user.actions"
// import { UserValidationSchema } from "@/lib/validations/user"

const PostRipple = ({ UserId }: { UserId: string }) => {

    const router = useRouter()
    const pathName = usePathname()
    const [loading, setloading] = useState(false)
    const {organization} = useOrganization()

    const form = useForm({
        resolver: zodResolver(RippleValidationSchema),
        defaultValues: {
            ripple: '',
            accountId: UserId
        }
    })


    const onSubmit = async (values: z.infer<typeof RippleValidationSchema>) => {
        try {
            console.log(organization)
            setloading(true)
                        await createRipple({
                text: values.ripple,
                author: UserId,
                communityId: organization ? organization.id : null,
                path: pathName
            })
            router.push('/')
        } catch (error) {
            throw new Error('Failed to create ripple')
        }
        finally {
            setloading(false)
        }

    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 space-y-8 flex flex-col justify-start gap-10 ">
                <FormField
                    control={form.control}
                    name="ripple"
                    render={({ field }) => (
                        <FormItem className="flex flex-col  gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Content
                            </FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className={`flex gap-2 ${loading ? '' : 'bg-primary-500 '}`}>
                    {loading ? 'Posting Ripple' : 'Post Ripple' }
                    {loading && <RotatingLines
                        strokeColor="grey"
                        strokeWidth="4"
                        animationDuration="1"
                        width="24"
                        visible={true}
                    />}
                </Button>
            </form>

        </Form >)

}

export default PostRipple