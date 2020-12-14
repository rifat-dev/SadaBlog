const Post = require('../../models/post')
const Comment = require('../../models/comment')

exports.commentPostController = async (req, res, next) => {

    let { postId } = req.params
    let { body } = req.body

    if (!req.user) {
        return res.status(403).json({
            error: 'Please Login First'
        })
    }

    try {
        let comment = new Comment({
            post: postId,
            user: req.user._id,
            body,
            replies: []
        })

        let createComment = await comment.save()
        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { 'comments': createComment._id } }
        )

        let commentJson = await  Comment.findById(createComment._id).populate(
            { 
                path:'user',
                select:'profilePics username'
            }
        )
        
        
        
        return res.status(201).json(commentJson)

    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: 'Server Error'
        })
    }


}

exports.replyCommentPostController = async (req, res,next) => {
    let {commentId} = req.params
    let { body } = req.body

    if(!req.user){
        return res.status(403).json({
            error: 'Please Login First'
        })
    }
    let reply ={
        body,
        user:req.user._id
    }

    try{
        await Comment.findOneAndUpdate(
            { _id:commentId},
            {$push:{
                'replies':reply
            }}
        )

        console.log(reply)

        return res.status(201).json({
            ...reply,
            profilePics:req.user.profilePics
        })
        

    }catch(e){
        console.log(e);
        res.status(500).json({
            error: 'Server Error'
        })
    }


}