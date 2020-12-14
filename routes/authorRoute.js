const router = require('express').Router()

const {authorGetController} = require('../controlers/authorController')

router.get('/:userId',authorGetController)

module.exports = router