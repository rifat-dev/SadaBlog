const { body } = require('express-validator')
const cheerio = require('cheerio')

module.exports= [
    body('title')
        .not().isEmpty().withMessage('Title Can Not Be Empty')
        .isLength({max:100}).withMessage('Title can not be greater than 100 characters')
        .trim()
    ,
    body('body')
        .not().isEmpty().withMessage('Body Can Not Be Empty')
        .trim()
        .custom(value=>{
            let node = cheerio.load(value)
            let text = node.text()
            text = text.replace(/(\r\r|\n|\r)/gm,"")
            if(text.length>5000){
                throw new Error('Text can not be greater than 5000 characters')
            }
            return true
        })
    ,
    body('tags')
        .not().isEmpty().withMessage('Tags Can not be empty')
        .trim()
        
]