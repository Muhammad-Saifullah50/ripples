import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    ripples: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ripple'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ]

})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User