import mongoose from "mongoose";

const RippleSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Community', 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId:{
        type: String
    },
    children:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ripple'
        }
    ]

})

const Ripple = mongoose.models.Ripple || mongoose.model('Ripple', RippleSchema)

export default Ripple