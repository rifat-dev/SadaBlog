const Flash = require('../utils/Flash')
const User = require('../models/user')
const Post = require('../models/post')
exports.authorGetController = async (req, res, next) => {
      let {userId} = req.params
     
    try {
        
        let author = await User.findById(userId)
                     .populate({
                         path:'profile',
                         select:'posts name title bio',               

                     })


        let posts = await Post.find({author:author._id})

        
            
        res.render('pages/explorer/author', {
            title: 'Author',
            flashMessage: Flash.getFlashMessage(req),
            author,
            posts
        })



    } catch (e) {
        next(e)
    }


}