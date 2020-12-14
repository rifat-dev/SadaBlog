//name,email,pass,profile

const {Schema,model} = require('mongoose')
// const Profile = require('./profile')


const userScgema = new Schema({
    username:{
        type:String,
        trim:true,
        maxlength:15,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
      type:String,
      required:true
    },
    profile:{
        type: Schema.Types.ObjectId,
        ref:'Profile'
    },
    profilePics:{
        type:String,
        default:'/uplodes/default.png'
    }
},{
    timestamps:true
})

const User=model('User',userScgema)

module.exports=User