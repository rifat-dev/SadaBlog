//postId,userID,body,reply[]
const { Schema, model } = require('mongoose')
// const User=require('./user')
// const Post=require('./post')
const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    replies: [
        {
            body: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt:{
                type:Date,
                default:new Date()
            }
        }
    ]
},{
    timestamps:true
})

const Comment=model('Comment',commentSchema)

module.exports=Comment