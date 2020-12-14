const { body } = require('express-validator')
const validator = require('validator')

const urlValidation = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Pleace provide A valid URL')
        }
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can Not Be Empty')
        .isLength({ max: 50 }).withMessage('Length can not be more then 50 chars')
        .trim(),
    body('title')
        .not().isEmpty().withMessage('Title Can Not Be Empty')
        .isLength({ max: 100 }).withMessage('Length can not be more then 100 chars')
        .trim(),
    body('bio')
        .not().isEmpty().withMessage('Bio Can Not Be Empty')
        .isLength({ max: 500 }).withMessage('Length can not be more then 500 chars')
        .trim(),
    body('website')
        .trim()
        .custom(urlValidation),
    body('facebook')
        .trim()
        .custom(urlValidation),
    body('gitHub')
        .trim()
        .custom(urlValidation)
]