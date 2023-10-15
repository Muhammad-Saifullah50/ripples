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
// import { UpdateUser } from "@/lib/actions/user.actions"
// import { UserValidationSchema } from "@/lib/validations/user"

const PostRipple = ({ UserId }: { UserId: string }) => {

    const router = useRouter()
    const pathName = usePathname()

    const form = useForm({
        resolver: zodResolver(RippleValidationSchema),
        defaultValues: {
            ripple: '',
            accountId: UserId
        }
    })


    const onSubmit = async (values: z.infer<typeof RippleValidationSchema>) => {
        await createRipple({
            text: values.ripple,
            author: UserId,
            communityId: null,
            path: pathName
        })
        router.push('/')
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
                <Button type="submit" className="bg-primary-500">Post Ripple</Button>
            </form>

        </Form >)

}

export default PostRipple