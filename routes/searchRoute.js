const router = require('express').Router()

const {searchGetResult} = require('../controlers/searchControler')

router.get('/',searchGetResult)

module.exports = router