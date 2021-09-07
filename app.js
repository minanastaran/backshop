const express=require('express')
const bodyParser = require('body-parser')   //Json
const HttpError = require('./Util/HttpError') //Error
const mongoose=require('mongoose') //Db
const fs=require('fs')  //upload
const path =require('path')     //upload
const checkauth=require('./Util/CheckAuth')

//import
const Product_Routes = require('./Routes/Product_Routes')
const User_Routes = require('./Routes/User_Routes')
const Sale_Routes = require('./Routes/Sale_Routes')
const Task_Routes = require('./Routes/Task_Routes')
const Manage_Routes = require('./Routes/Manage_Routes.js')

const app = express()
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 
app.use( bodyParser.json()); 

app.use('/Uploads/products', express.static(path.join('Uploads','products'))) //image upload
app.use('/Uploads/images', express.static(path.join('Uploads','images'))) //image upload

//Cors Handler
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','*')
    res.setHeader('Access-Control-Allow-Methods','*')
    next()
})

// //check auth
// app.use(checkauth)

//Routes
app.use('/Products',Product_Routes)
app.use('/User',User_Routes)
app.use('/Sale',Sale_Routes)
app.use('/Task',Task_Routes)
app.use('/Manage',Manage_Routes)

//------------ Error Handler ------------

//FileError
app.use((error, req, res, next) => {
    let files=req.file
    if (files) {
        for (let i = 0; i < files.length; i++) {
            fs.unlink(files[i].path, (err) => {
                console.log(err)
            })
        }
    }
    if (res.headerSet) {
        return next(error)
    }
    res.status(500).json({ message:'Error ' + error.message })
})
//Wrong Url
app.use((req,res,next)=>{
    const error=new HttpError('InValid Url ...',404)
    throw error
})

mongoose.connect('mongodb://127.0.0.1:27017/shop')
.then(()=>{
    app.listen(5000)
})
.catch(err=>{
    console.log('connected failed ...')
})