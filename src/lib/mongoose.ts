import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGODB_URI) return console.log('Mongodb uri not found')
    if (isConnected) return console.log('Already connected to db')

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        isConnected = true
        console.log('conected to mongodb')
    } catch (error) {
        console.log(error)
    }
}