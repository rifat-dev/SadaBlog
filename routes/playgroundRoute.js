const router = require('express').Router()
const uplode = require('../midelware/uplodeMidelware')

router.get('/play', (req, res, next) => {
    res.render('playground/play', { title: 'playground', flashMessage: {} })
})
router.post('/play',uplode.single('my-file') ,(req, res, next) => {
    if(req.file){
        console.log(req.file);
    }
   res.redirect('/playground/play')
})

module.exports = router