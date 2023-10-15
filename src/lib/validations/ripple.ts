import * as z from 'zod'

export const RippleValidationSchema = z.object({
    ripple: z.string().min(3, {message: 'Ripple should be minimum 3 characters'}),
    accountId: z.string()
})

export const CommentValidationSchema = z.object({
    ripple: z.string().min(3, {message: 'Ripple should be minimum 3 characters'}),
})