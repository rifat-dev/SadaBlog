const { body } = require('express-validator')
const User = require('../../models/user')
module.exports = [
    body('username')
        .isLength({ min: 2, max: 15 })
        .withMessage('Username must be 2 to 15 chars')
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject('Username Already Used')
            }
        })
        .trim()
    ,
    body('email')
        .isEmail().withMessage('Provide A Valide Email')
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject('Email Alredy Used')
            }
        })
        .normalizeEmail()
    ,
    body('password')
        .not().isEmpty().withMessage('Password Can Not Be Empty')
        .isLength({ min: 6 }).withMessage('Password Must Be Greater Than 6 Chars')
    ,
    body('confirmPassword')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Password Does Not Match')
            }
            return true
        })
]