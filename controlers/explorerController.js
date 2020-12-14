const moment = require('moment')
const Post = require('../models/post')
const Profile = require('../models/profile')
const Flash = require('../utils/Flash')
function generateDate(days) {
    let date = moment(days).subtract(days, 'days')
    return date.toDate()
}


function generateFilterObject(filter) {
    let filterObj = {}
    let order = 1

    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt : {
                    $gt: generateDate(7)
                }
            }
            order = -1
            break;
        }
        case 'month': {
            filterObj = {
                createdAt : {
                    $gt: generateDate(30)
                }
            }
            order = -1
            break;
        }
        case 'all': {           
            order = -1
            break;
        }
    }

    return {
        filterObj,
        order
    }
}

exports.explorerGetController = async (req, res, next) => {

    let filter = req.query.filter || 'latest'
    let { filterObj, order } = generateFilterObject(filter.toLowerCase())

    let itemPerPage = 2
    let currentPage = parseInt(req.query.page) || 1
    

    try {
        let posts = await Post.find(filterObj)
                   .populate('author','username')
                   .sort(order === 1 ? '-createdAt': 'createdAt')
                   .skip(currentPage * itemPerPage - itemPerPage )
                   .limit(itemPerPage)

        let totalPost = await Post.countDocuments()
        let totalPage = totalPost / itemPerPage

        let bookmarks = []
        if(req.user){
            let profile = await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }


        res.render('pages/explorer/explorer', {
            title: 'All Posts',
            filter,
            flashMessage: Flash.getFlashMessage(req),
            posts,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks
        })

    } catch (e) {
        next(e)
    }

}


exports.singlePostGetController = async (req, res, next) => {
    let {postId } = req.params

    try{
      let post = await Post.findById(postId)
                .populate('author','username profilePics')
                .populate({ 
                    path: 'comments', 
                    populate:{
                        path:'user',
                        select:'username profilePics'
                    }
                })
                .populate({ 
                    path:'comments',
                    populate:{
                        path:'replies.user',
                        select:'username profilePics'
                    }
                })

       if(!post){
           let error = new Error('404 Page Not Found')
           error.status = 404
           throw error
       }

       let bookmarks = []
        if(req.user){
            let profile = await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePostView',{
            title: post.title,
            flashMessage: Flash.getFlashMessage(req),
            post,
            bookmarks
        })


    }catch(e){
        next(e)
        console.log(e);
    }
}