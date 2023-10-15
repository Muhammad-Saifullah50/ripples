'use server'

import { revalidatePath } from "next/cache"
import Ripple from "../models/ripple.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Params {
    text: string
    author: string,
    communityId: string | null
    path: string
}

export const createRipple = async ({ text, author, communityId, path }: Params) => {
    try {
        connectToDB()

        const createdRipple = await Ripple.create({
            text,
            author,
            communityId: null
        })

        //update user model by the ripple

        await User.findByIdAndUpdate(author, {
            $push: { ripples: createdRipple._id }
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error creating ripple ${console.log(error?.message)}`)
    }

}