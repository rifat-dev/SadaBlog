const Post = require('../../models/post')

exports.likeGetController = async (req, res, next) => {
    let { postId } = req.params

    let liked = null

    if (!req.user) {
        return res.status(403).json({
            error: 'Please Login First'
        })
    }

    let userId = req.user._id

    try {
        let post = await Post.findById(postId)
        if (post.dislike.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislike': userId } }
            )
        }

        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } }
            )
            liked = false
        } else {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { 'likes': userId } }
            )
            liked = true
        }


        let updatedPost = await Post.findById(postId)

        res.status(200).json({
            liked: liked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislike.length
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: 'Server Error'
        })
    }

}

exports.dislikesGetController = async (req, res, next) => {
    let { postId } = req.params

    let disliked = null

    if (!req.user) {
        return res.status(403).json({
            error: 'Please Login First'
        })
    }
    let userId = req.user._id
    try {
        let post = await Post.findById(postId)
        if (post.likes.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'likes': userId } }
            )
        }

        if (post.dislike.includes(userId)) {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { 'dislike': userId } }
            )
            disliked = false
        } else {
            await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { 'dislike': userId } }
            )
            disliked = true
        }


        let updatedPost = await Post.findById(postId)

        return res.status(200).json({
            disliked:disliked,
            totalLikes: updatedPost.likes.length,
            totalDislikes: updatedPost.dislike.length
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: 'Server Error'
        })
    }

}