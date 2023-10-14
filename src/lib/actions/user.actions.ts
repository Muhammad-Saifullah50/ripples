'use server'

import User from "../models/user.model"
import { connectToDB } from "../mongoose"

export const UpdateUser = async (userId: string): Promise<void> => {
     connectToDB()

    await User.findOneAndUpdate(
        {id: userId},
        )
}