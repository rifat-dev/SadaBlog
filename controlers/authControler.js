const User = require('../models/user')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const formater = require('../utils/validationFormater')
const Flash = require('../utils/Flash')

exports.signupGet = (req, res, next) => {
    res.render('pages/auth/signup',
        {
            title: 'Create A New Account',
            error: {},
            value: {},
            flashMessage: Flash.getFlashMessage(req)
        })
}


exports.signupPost = async (req, res, next) => {

    //validation
    let { username, email, password } = req.body
    let errors = validationResult(req).formatWith(formater)
    req.flash('fail','Pleace Check Your Form !')
    if (!errors.isEmpty()) {
        return res.render('pages/auth/signup',
            {
                title: 'Create A New Account',
                error: errors.mapped(),
                value: {
                    username,
                    email,
                    password
                },
                flashMessage: Flash.getFlashMessage(req)
            })
    }

    try {
        let hashPassword = await bcrypt.hash(password, 11)
        let user = new User({
            username,
            email,
            password: hashPassword,
        })

        let createUser = await user.save()
        req.flash('success','User Created Successfully ')
        res.redirect('/auth/login')
    } catch (e) {
        next(e)
    }

}



exports.loginGet = (req, res, next) => {
    res.render('pages/auth/login',
        {
            title: 'LogIn to your account',
            error: {},
            flashMessage: Flash.getFlashMessage(req)
        })
}


exports.loginPost = async (req, res, next) => {
    const { email, password } = req.body

    let errors = validationResult(req).formatWith(formater)
    if (!errors.isEmpty()) {
        req.flash('fail','Pleace Check Your Form !')
        return res.render('pages/auth/login',
            {
                title: 'LogIn to your account',
                error: errors.mapped(),
                flashMessage: Flash.getFlashMessage(req)
            })
    }

    try {
        let user = await User.findOne({ email })
        // if (!user) {
        //     res.json({
        //         msg: 'email/password not match'
        //     })
        // }

        // let match = await bcrypt.compare(password, user.password)
        // if (!match) {
        //     res.json({
        //         msg: 'email/password not match'
        //     })
        // }

        console.log('Success Log In')
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(e => {
            if (e) {
                console.log(e)
                return next(e)
            }
            req.flash('success','Successfully Logged In ')
            return res.redirect('/dashbord')
        })
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.logout = (req, res, next) => {
    
    req.session.destroy(e => {
        if (e) {
            return next(e)
        }
       
        return res.redirect('/auth/login')
    })
    
}

exports.changepasswordGetController = (req, res, next) => {

    res.render('pages/auth/changePassword',{
        title: 'Change Your Password',
        flashMessage: Flash.getFlashMessage(req)
    })

}
exports.changepasswordPostController = async (req, res, next) => {
    let {oldpassword,newpassword,confirmpassword} = req.body

    if(oldpassword==='' || newpassword==='' || confirmpassword===''){
        req.flash('fail','Password Cannot Be Empty')
        return res.redirect('/auth/change-password')
    }

    console.log(newpassword, confirmpassword)

    if(newpassword !== confirmpassword){
        req.flash('fail','Password Dose Not match ')
        return res.redirect('/auth/change-password')
    }


    try{

        let match = await bcrypt.compare(oldpassword, req.user.password)
        console.log(match)
        if(!match){
            req.flash('fail','Invalide Old Password')
            return res.redirect('/auth/change-password')
        }

        let hash = await bcrypt.hash(newpassword,11)

        console.log(hash)
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set:{password:hash}}
        )
        req.flash('success','Password changed successfully ')
        return res.redirect('/auth/change-password')


    }catch(e){
        next(e)
    }

    
}