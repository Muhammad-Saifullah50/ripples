'use server'

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Ripple from "../models/ripple.model"
import { FilterQuery, SortOrder } from "mongoose"

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}
export const UpdateUser = async ({ userId, username, name, bio, image, path }: Params

): Promise<void> => {
    connectToDB()

    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        )

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(` Failed to create/update user ${error?.message}`)
    }
}

export const fetchUser = async (userId: string) => {
    try {
        connectToDB()

        const CurrUser = await User
            .findOne({ id: userId })
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
        return CurrUser
    } catch (error: any) {
        throw new Error(`Failed to fetch user ${error?.message}`)
    }
}

export const fetchUserPosts = async (userId: string) => {
    try {
        connectToDB()
        const ripples = await User.findOne({ id: userId })
            .populate({
                path: 'ripples',
                model: Ripple,
                populate: ({
                    path: 'children',
                    model: Ripple,
                    populate: ({
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    })
                })
            })
        return ripples
    } catch (error: any) {
        throw new Error(`Failed to fetch posts ${error?.message}`)
    }
}

export const fetchUsers = async ({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
}: {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}) => {
    try {
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const UserQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await UserQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length

        return { users, isNext }
    } catch (error: any) {
        throw new Error(`Failed to fetch users ${error?.message}`)
    }
}