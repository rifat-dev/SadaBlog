const router = require('express').Router()
const { isAuthenticated } = require('../midelware/authMidelware')
const uplode = require('../midelware/uplodeMidelware')
const {
    uplodeProfilePics,
    removeProfilePics,
    postImageUplodeControler
} = require('../controlers/uplodeControler')


router.post('/profilePics',
    isAuthenticated,
    uplode.single('profilePics'),
    uplodeProfilePics
)

router.delete('/profilePics', isAuthenticated, removeProfilePics)

router.post('/postimage',isAuthenticated,uplode.single('post-image'),postImageUplodeControler)

module.exports = router