const router = require('express').Router()
const uplode = require('../midelware/uplodeMidelware')
const postValidator = require('../validation/dashbord/postValidation')
const { isAuthenticated } = require('../midelware/authMidelware')
const {
    createPostGetControler,
    createPostPostControler,
    editPostGetControler,
    editPostPostController,
    deletePostGetController,
    postGetController
} = require('../controlers/postControler')

router.get('/create', isAuthenticated, createPostGetControler)
router.post('/create', isAuthenticated, uplode.single('postThumbail'), postValidator, createPostPostControler)


router.get('/edit/:postId', isAuthenticated, editPostGetControler)
router.post('/edit/:postId', isAuthenticated, uplode.single('postThumbail'), postValidator, editPostPostController)


router.get('/delete/:postId', isAuthenticated, deletePostGetController)

router.get('/', isAuthenticated, postGetController)

module.exports = router