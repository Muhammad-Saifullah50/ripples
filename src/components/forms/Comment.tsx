'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Form } from "../ui/form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { CommentValidationSchema } from "@/lib/validations/ripple"
import Image from "next/image"
import { addCommentToRipple } from "@/lib/actions/ripple.actions"

interface Props {
    rippleId: string
    currentUserImage: string
    currentUserId: string
}

const Comment = ({ rippleId, currentUserImage, currentUserId }: Props) => {

    const router = useRouter()
    const pathName = usePathname()

    const form = useForm({
        resolver: zodResolver(CommentValidationSchema),
        defaultValues: {
            ripple: '',
        }
    })


    const onSubmit = async (values: z.infer<typeof CommentValidationSchema>) => {
       await addCommentToRipple(rippleId, values.ripple, JSON.parse(currentUserId), pathName)
        form.reset()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">
                <FormField
                    control={form.control}
                    name="ripple"
                    render={({ field }) => (
                        <FormItem className="flex items-center  gap-3 w-full">
                            <FormLabel>
                                <Image
                                    src={currentUserImage}
                                    alt="profile iamge"
                                    width={48}
                                    height={48}
                                    className="object-cover rounded-full"
                                />

                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type='text'
                                    placeholder="Comment ..."
                                    className="no-focus text-light-1 outline-none"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="bg-primary-500 comment-form_btn hover:bg-tertiary-500">Reply</Button>
            </form>

        </Form >
    )
}

export default Comment