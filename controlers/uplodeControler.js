const fs = require('fs')
const User = require('../models/user')
const Profile = require('../models/profile')

exports.uplodeProfilePics = async (req, res, next) => {
    if (req.file) {
        try {
            let oldProfilePic = req.user.profilePics
            let profile = await Profile.findOne({ user: req.user._id })
            let profilePics = `/uplodes/${req.file.filename}`

            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics } }
                )
            }

            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics } }
            )


            if(oldProfilePic !== '/uplodes/default.png'){
                fs.unlink(`public${oldProfilePic}`,err=>{ 
                    if(err){
                        console.log(err)
                    }
                })
            }
            res.status(200).json({
                profilePics
            })

        } catch (e) {
            res.status(500).json({
                profilePics: req.user.profilePics
            })
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics
        })
    }
}

exports.removeProfilePics =  (req, res, next) => {
    let defaultPic = '/uplodes/default.png'
    let currentPic = req.user.profilePics
    try {
        fs.unlink(`public${currentPic}`, async (err)=>{
            let profile = await Profile.findOne({ user: req.user._id })
         
    
            if(profile){
                await Profile.findOneAndUpdate(
                    {user:req.user._id},
                    {$set:{
                        profilePics:defaultPic
                    }}
                )
            }
    
            await User.findOneAndUpdate(
                {_id:req.user._id},
                {$set:{
                    profilePics:defaultPic
                }}
            )
        })
        res.status(200).json({
            profilePics:defaultPic
        })




    } catch (e) {
        console.log(e);
        res.status(500).json({
           message:'Can Not Remove Pics'
        })
    }
}


exports.postImageUplodeControler=(req,res,next)=>{
     if(req.file){
         return res.status(200).json({
             imgUrl:`/uplodes/${req.file.filename}`
         })
     }

     return res.status(500).json({
        message:'Image Can Not Uploded'
     })
}