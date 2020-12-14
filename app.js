require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const flash= require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express()


//import midelware
const {bindUserWithReq} = require('./midelware/authMidelware')
const setLocals = require('./midelware/setLocals')

//import routes
const authRouts = require('./routes/authRoute')
const authorRoute = require('./routes/authorRoute')
const dashbordRouts= require('./routes/deshbordRoute')
const uplodeRoute = require('./routes/uplodeRoute')
const postRoute = require('./routes/postRoute')
const apiRoute = require('./api/routes/apiRoute')
const explorRoute = require('./routes/explorRoute')
const searchRoute = require('./routes/searchRoute')
const playgroundRouts=require('./routes/playgroundRoute')

//view engine ejs
app.set('view engine', 'ejs')
app.set('views', 'views')

//session setup===

let DB_ADMIN = process.env.DB_ADMIN
let DB_PASS= process.env.DB_PASS
const url = `mongodb+srv://${DB_ADMIN}:${DB_PASS}@cluster0.ltldm.mongodb.net/blogWebsite?retryWrites=true&w=majority`
var store = new MongoDBStore({
    uri: url,
    collection: 'mySessions'
  });

//midleware
const middleware = [
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret:process.env.SECRET_KEY || 'SECRET_KEY',
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:60*60*2*1000
        },
        store:store
    }),
    bindUserWithReq(),
    setLocals(),
    flash()
]

app.use(middleware)

if(app.get('env').toLowerCase()==='development'){
    app.use(morgan('dev'))
}
//====routers

app.use('/auth', authRouts)
app.use('/author',authorRoute)
app.use('/dashbord',dashbordRouts)
app.use('/uplodes',uplodeRoute)
app.use('/posts',postRoute)
app.use('/api',apiRoute)
app.use('/web',explorRoute)
app.use('/search',searchRoute)
app.use('/playground',playgroundRouts)

app.get('/', (req, res,next)=>{
     res.redirect('/web')
})

///404 && 500 Pages
app.use((req,res,next)=>{
    let error = new Error('404 Not Found')
     error.status= 404
     next(error)
})

app.use((error,req, res,next) => {
    if(error.status === 404){
        res.render('pages/error/404',{title:'404 not found',error:{},flashMessage:{}})
    }else{
        res.render('pages/error/500',{title:'500 not found',error:{},flashMessage:{}})
    }
})


//////////// database connect

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true ,useFindAndModify: false,useCreateIndex: true})
    .then(() => {
        const port = process.env.PORT || 8080

        app.listen(port, () => {
            console.log('Server is running ' + port);
            console.log('Database connect..')
        })
    })
    .catch((e)=>{
        return console.log(e)
    })
