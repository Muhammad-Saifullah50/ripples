import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGODB_URI) return console.log('Mongodb uri not found')
    if (isConnected) return console.log('Already connected to db')

    try {
        
    } catch (error) {
        
    }
}