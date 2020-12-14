const router = require('express').Router();
const {isAuthenticated} = require('../../midelware/authMidelware')


const {commentPostController,
    replyCommentPostController
} = require('../controlers/commentController')

const {likeGetController,dislikesGetController} = require('../controlers/likeDislikeController')

const {bookmarksGetController} = require('../controlers/bookmarksController')

router.post('/comments/:postId',isAuthenticated,commentPostController)
router.post('/comments/replies/:commentId',isAuthenticated,replyCommentPostController)

router.get('/likes/:postId',isAuthenticated,likeGetController)
router.get('/dislikes/:postId',isAuthenticated,dislikesGetController)

router.get('/bookmarks/:postId',isAuthenticated,bookmarksGetController)






module.exports = router