const router = require('express').Router()

const {explorerGetController,singlePostGetController} = require('../controlers/explorerController')


router.get('/:postId',singlePostGetController)
router.get('/',explorerGetController)



module.exports = router