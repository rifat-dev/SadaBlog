const { validationResult } = require('express-validator')
const User = require('../models/user')
const Profile = require('../models/profile')
const Comment = require('../models/comment')

const Flash = require('../utils/Flash')
const errorFormater = require('../utils/validationFormater')


exports.deshbordGet = async (req, res, next) => {

    try {

        let profile = await Profile.findOne({ user: req.user._id })
            .populate({
                path: 'posts',
                select: 'title thumbail'
            })
            .populate({
                path: 'bookmarks',
                select: 'title thumbail'
            })

        if (profile) {
            return res.render('pages/dashbord/dashbord', {
                title: 'My Dashbord',
                flashMessage: Flash.getFlashMessage(req),
                posts: profile.posts.reverse().slice(0, 3),
                bookmarks: profile.bookmarks.reverse().slice(0, 3)
            })
        }

        res.redirect('/dashbord/create-profile')

    } catch (e) {
        next(e)
    }
}

exports.createProfileGetControler = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })

        if (profile) {
            return res.redirect('/dashbord/edit-profile')
        }

        res.render('pages/dashbord/create-profile', {
            title: 'Create profile',
            flashMessage: Flash.getFlashMessage(req),
            error: {}
        })

    } catch (e) {
        next(e)
    }
}

exports.createProfilePostControler = async (req, res, next) => {
    let { name, title, bio, website, facebook, gitHub } = req.body
    let profilePics = req.user.profilePics
    let posts = []
    let bookmarks = []

    let errors = validationResult(req).formatWith(errorFormater)
    if (!errors.isEmpty()) {
        return res.render('pages/dashbord/create-profile', {
            title: 'Create profile',
            flashMessage: Flash.getFlashMessage(req),
            error: errors.mapped()
        })
    }


    try {

        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                gitHub: gitHub || ''
            },
            posts,
            bookmarks

        })

        let createdProfile = await profile.save()
        await User.findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                profile: createdProfile._id
            }
        })

        req.flash('success', 'Profile Created successfully')
        res.redirect('/dashbord')



    } catch (e) {
        next(e)
    }
}



exports.editProfileGetControler = async (req, res, next) => {
    try {

        let profile = await Profile.findOne({ user: req.user._id })
        if (!profile) {
            return res.redirect('/dashbord/create-profile')
        }


        res.render('pages/dashbord/edit-profile', {
            title: 'Edit your Profile',
            profile,
            error: {},
            flashMessage: Flash.getFlashMessage(req)
        })


    } catch (e) {
        next(e)
    }
}


exports.editProfilePostControler = async (req, res, next) => {

    let errors = validationResult(req).formatWith(errorFormater)

    let { name, title, bio, website, facebook, gitHub } = req.body

    if (!errors.isEmpty()) {
        return res.render('pages/dashbord/edit-profile', {
            title: 'Edit your profile',
            flashMessage: Flash.getFlashMessage(req),
            error: errors.mapped(),
            profile: {
                name,
                title,
                bio,
                links: {
                    website,
                    facebook,
                    gitHub
                }
            }
        })
    }


    try {

        let profile = new Profile({
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                gitHub: gitHub || ''
            }
        })

        console.log(profile);
        let updateProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: {'Profile':profile } },
            { new: true }
        )

        console.log('update : ' + updateProfile);
        req.flash('success', 'Profile Updated successfully')
        res.render('pages/dashbord/edit-profile', {
            title: 'Edit Your Profile',
            error: {},
            profile: profile,
            flashMessage: Flash.getFlashMessage(req)
        })

    } catch (e) {
        next(e)
    }
}


exports.bookmarksGetControler = async function (req, res, next) {


    try {

        let profile = await Profile.findOne({ user: req.user._id })
            .populate({
                path: 'bookmarks',
                model: 'Post',
                select: 'title thumbail'
            })

        res.render('pages/dashbord/bookmarks', {
            title: 'My Bookmarks',
            flashMessage: Flash.getFlashMessage(req),
            posts: profile.bookmarks
        })

    } catch (e) {
        next(e)
    }
}


exports.comentsGetController = async (req, res, next) => {

    try {

        let profile = await Profile.findOne({ user: req.user._id })



        let comments = await Comment.find({ post: { $in: profile.posts } })
            .populate({
                path: 'post',
                select: 'title'
            })
            .populate({
                path: 'user',
                select: 'username profilePics'
            })
            .populate({
                path: ' replies',
                select: 'user'
            })

        res.render('pages/dashbord/comments', {
            title: 'All Comments',
            flashMessage: Flash.getFlashMessage(req),
            comments
        })

    } catch (e) {
        next(e)
    }
}