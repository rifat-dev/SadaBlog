//title,body,author,tags,thumbial,readTime,likes,dislikes,comments

const {Schema,model} = require('mongoose')
// const User=require('./user')
// const Comment=require('./comment')

const postSchema=new Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:100
    },
    body:{
        type:String,
        required:true,
        maxlength:5000
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    tags:[{
        type:String,
        required:true,
     }],
    thumbail:String,
    readTime:String,
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    dislike:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},{
    timestamps:true,
    
})

postSchema.index({
    title:'text',
    body:'text',
    tags:'text',
},{
    weights:{
        title:5,
        tags:5,
        body:2
    }
})

const Post = model('Post',postSchema)


module.exports=Post