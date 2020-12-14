const router = require('express').Router()
const { isAuthenticated } = require('../midelware/authMidelware')
const profileValidator = require('../validation/dashbord/profileValidation')
const {
    deshbordGet,
    createProfileGetControler,
    createProfilePostControler,
    editProfileGetControler,
    editProfilePostControler,
    bookmarksGetControler,
    comentsGetController
} = require('../controlers/deshbordControler')


router.get('/bookmarks',isAuthenticated,bookmarksGetControler)
router.get('/comments',isAuthenticated,comentsGetController)

router.get('/create-profile', isAuthenticated, createProfileGetControler)
router.post('/create-profile', isAuthenticated, profileValidator, createProfilePostControler)


router.get('/edit-profile', isAuthenticated, editProfileGetControler)
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostControler)


router.get('/', isAuthenticated, deshbordGet)

module.exports = router