const { body } = require('express-validator')
const User = require('../../models/user')
const bcrypt = require('bcrypt')

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Email Can Not Be Empty')
        .isEmail().withMessage('Provide A Valide Email')
        .custom(async email => {
            let user = await User.findOne({ email })
            if (!user) {
                return Promise.reject('email or password dose not match')
            }
        })
    ,
    body('password')
        .not().isEmpty().withMessage('Password Can Not Be Empty')
        .custom(async (password, { req }) => {
            let email = req.body.email
            let user = await User.findOne({ email })
            if (user) {
                let match = await bcrypt.compare(password, user.password)
                if (!match) {
                    return Promise.reject('email or password dose not match')
                }
            }else{
                return Promise.reject('email or password dose not match')
            }
        })
]