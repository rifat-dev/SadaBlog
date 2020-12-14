const Post = require('../models/post')
const Profile = require('../models/profile')

const Flash = require('../utils/Flash')
const redingTime = require('reading-time')

const { validationResult } = require('express-validator')
const errorFormater = require('../utils//validationFormater')
exports.createPostGetControler = (req, res, next) => {
    res.render('pages/dashbord/post/createPost', {
        title: 'Create Post',
        error: {},
        value: {},
        flashMessage: Flash.getFlashMessage(req)
    })
}

exports.createPostPostControler = async(req, res, next) => {
    let { title, body, tags } = req.body
    let errors = validationResult(req).formatWith(errorFormater)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Can not create post')
        res.render('pages/dashbord/post/createPost', {
            title: 'Create Post',
            error: errors.mapped(),
            flashMessage: Flash.getFlashMessage(req),
            value: {
                title,
                body
            }
        })
    }

    if (tags) {
        tags = tags.split(',')
    }

    let readTime = redingTime(body).text



    let post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: [],
    })

    if (req.file) {
        post.thumbail = `/uplodes/${req.file.filename}`
    }

    try {

        let createPost = await post.save()

        await Profile.findOneAndUpdate({ user: req.user._id }, { $push: { 'posts': createPost._id } })


        return res.redirect(`/posts/edit/${createPost._id}`)

    } catch (e) {
        next(e)
        console.log(e);
    }

}

exports.editPostGetControler = async(req, res, next) => {
    let postId = req.params.postId

    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if (!post) {
            let error = new Error('404 Not Found')

            error.status = 404
            throw error
        }

        res.render('pages/dashbord/post/editPost', {
            title: 'Edit Your Post',
            error: {},
            flashMessage: Flash.getFlashMessage(req),
            post
        })

    } catch (e) {
        next(e)
        console.log(e)
    }

}

exports.editPostPostController = async(req, res, next) => {
    let { title, body, tags } = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormater)

    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if (!post) {
            let error = new Error('404 Not Found')

            error.status = 404
            throw error
        }

        if (!errors.isEmpty()) {
            req.flash('fail', 'Something Error')
            res.render('pages/dashbord/post/editPost', {
                title: 'Edit Your Post',
                error: errors.mapped(),
                flashMessage: Flash.getFlashMessage(req),
                post

            })
        }

        if (tags) {
            tags = tags.split(',')
        }

        let thumbail = post.thumbail
        if (req.file) {
            thumbail = req.file.filename
        }

        let updatedPost = await Post.findOneAndUpdate({ _id: post._id }, { $set: { title, body, tags, thumbail } }, { new: true })

        console.log(updatedPost)

        req.flash('success', 'Post Updated Successfully')
        res.render('pages/dashbord/post/editPost', {
            title: 'Edit Your Post',
            error: {},
            flashMessage: Flash.getFlashMessage(req),
            post: updatedPost

        })

    } catch (e) {
        next(e)
        console.log(e)
    }

}


exports.deletePostGetController = async(req, res, next) => {
    let postId = req.params.postId

    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if (!post) {
            let error = new Error('404 Not Found')

            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({ _id: postId })
        await Profile.findOneAndUpdate({ user: req.user._id }, { $pull: { 'posts': postId } })
        req.flash('success', 'Post Delete Successfully')
        res.redirect('/posts')

    } catch (e) {
        next(e)
        console.log(e)
    }
}

exports.postGetController = async(req, res, next) => {
    try {

        let posts = await Post.find({ author: req.user._id })
        res.render('pages/dashbord/post/posts', {
            title: "My created Posts",
            posts,
            flashMessage: Flash.getFlashMessage(req)
        })

    } catch (e) {
        next(e)
        console.log(e)
    }
}