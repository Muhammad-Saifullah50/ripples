'use server'

import { revalidatePath } from "next/cache"
import Ripple from "../models/ripple.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { threadId } from "worker_threads"
import mongoose from "mongoose"

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

export const fetchRippleById = async (id: string) => {
    connectToDB()
    // populatre community
    try {
        const ripple = await Ripple.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Ripple,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec();
        return ripple
    } catch (error: any) {
        throw new Error(`Error fetching ripple ${error?.message}`)
    }
}

export const addCommentToRipple = async (
    rippleId: string,
    commentText: string,
    userId: string,
    path: string
) => {

    connectToDB()
    try {
        // find tge orginal ripple by its id
        const originalRipple = await Ripple.findById(rippleId)
        console.log(originalRipple)
        if (!originalRipple) throw new Error('Ripple not found')

        // create a new ripple with the comment
        const commentRipple = new Ripple({
            text: commentText,
            author: userId,
            parentId: rippleId
        })

        // save the new ripple
        const savedCommentRipple = await commentRipple.save();

        // update the original ripple to include the new comment
        originalRipple.children.push(savedCommentRipple._id)

        await originalRipple.save();

        revalidatePath(path)

    } catch (error: any) {
        throw new Error(`error adding comment to ripple ${error?.message}`)
    }
}