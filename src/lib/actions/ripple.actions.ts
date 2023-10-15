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

export const fetchRipples = async (pageNumber = 1, pageSize = 20) => {
    try {
        connectToDB()
        // calculate the number of posts to skip
        const skipAmount = (pageNumber - 1) * pageSize

        // we have to fetch posts having no parents(meaning they are original posts nor comments)

        const postsQuery = Ripple.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            });

        const totalPostsCount = await Ripple.countDocuments({ parentId: { $in: [null, undefined] } });

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length
        return { posts, isNext }
    } catch (error) {

    }
}