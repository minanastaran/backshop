const {validationResult}=require('express-validator')
const fs =require('fs')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const HttpError=require('../Util/HttpError')
var nodemailer = require("nodemailer");
const User = require('../Models/User')
const { eventNames } = require('cluster')

const Show_All_Users=async(req,res,next)=>{
    let users
    try {
        users=await User.find({},'-password')
        // users=await User.find({})
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:users,message:'Show All User ...'})
}

const Show_UserBy_Id=async(req,res,next)=>{
    const id=req.params.uid
    let users
    try {
        users=await User.findOne({_id:id})
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:users,message:'Show User ...'})
}

const Check_User=async(req,res,next)=>{
    const userid = req.body.userid
    let find_user
    try {
        find_user=await User.findById(userid)
        if(find_user){
            res.status(200).json({data:true})
        }
        else{
            res.status(200).json({data:false})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
}

const Show_User_LikeList = async(req,res,next)=>{
    const userId=req.params.uid
    let likelist
    try {
        likelist=await User.findOne({_id:userId})
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:likelist.like,message:'Show User ...'})
}

//login
const CheckLogin_Users=async(req,res,next)=>{ 
    const {user_Id , user_pass}=req.body
    console.log(user_Id + ' - ' + user_pass);

    let check_user
    let token
    try {
        check_user = await User.findOne({_id:user_Id})
        console.log(check_user);
        if(check_user){
            let isValid_UserPassword = false
            try {
                isValid_UserPassword = await bcrypt.compare(user_pass, check_user.password)
                if(isValid_UserPassword){
                    // res.status(200).json({data:'ok' , m:check_user})
                    try {
                        token = jwt.sign(
                            {   userId:check_user._id, 
                                userName:check_user.name,
                                password:check_user.password,
                                profile:check_user.profile,
                                like:check_user.like,
                            },
                            'secret_key',
                        )
                    } catch (err) {
                        res.status(500).json({message:'login faild...'})
                    }
                    res.status(201).json({data:'ok',
                        userId:check_user._id, 
                        userName:check_user.name,
                        password:check_user.password,
                        profile:check_user.profile,
                        like:check_user.like,
                        token: token
                    }) 
                }
                else{
                    res.status(200).json({data:'pass'})
                }
            } catch (err) {
                res.status(500).json({message:' password is Unvalid ...'})
                return next()
            }
        }
        else{
            res.status(200).json({data:'no user'})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
}

//register
const Create_User=async(req,res,next)=>{  
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(422).json({message:'Invalid Inputs ...'})
        return next()
    }

    let { name , email , id, password} = req.body 

    /*---------------------- send email ------------------------*/   
    console.log(email)

    var transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port:465,
        secure: true, // true for 465, false for other ports
        tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
        },
        auth: {
            user: 'mina.nastaran1371@gmail.com', // generated ethereal user
            pass: 'minanastaran1921371', // generated ethereal password
        }
    });

    let mailOptions={
        from:'mina.nastaran1371@gmail.com',
        to:email,
        subject: 'Welcome to Shop ',
        html:
        `
        <h3> Wlcome to Shop </h3>
        <ul>
        <li> Your phone : ${id} </li>
        <li> Your Email Address : ${email} </li>
        <li> Your Name is : ${name} </li>
        </ul>
        `
    };

    transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    });

    /*----------------------------------------------------------*/       

    let existingUser
    try {
        existingUser = await User.findOne({ _id: id })
    } catch (err) {
        res.status(500).json({message:"singUp faild ..."})
        return next(err)
    }

    if (existingUser) {
        const error = new HttpError('User exist.', 422)
        return next(error)
    }

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        res.status(500).json({message:"Could not create user..."})
        return next()
    }

    const createdUser = new User({
        _id: id,
        name: name,
        password: hashedPassword,
        profile: req.file ? req.file.path : [],
        like:[],
        products: []
    })

    try {
        await createdUser.save()
    } catch (err) {
        res.status(500).json({message:'Sing up faild...'})
        return next()
    }

    let token
    try {
        token = jwt.sign(
            {   userId:createdUser._id, 
                userName:createdUser.name,
                password:createdUser.password,
                profile:createdUser.profile,
                like:createdUser.like,
            },
            'secret_key',
        )
    } catch (err) {
        res.status(500).json({message:'Sing up faild...'})
    }
    res.status(201).json({
        userId:createdUser._id, 
        userName:createdUser.name,
        password:createdUser.password,
        profile:createdUser.profile,
        like:createdUser.like,
        token: token
    }) 
}

const ChangeProfileImage=async(req,res,next)=>{
    const id=req.body.id
    let find_user
    try {
        find_user= await User.findOne({"_id":id})
        if(find_user.profile.length>0){
            fs.unlink(find_user.profile[0], (err) => {
                console.log(err)
            })
        }
        try {
            update = await User.updateOne({_id:id} , {"$set":{"profile":req.files[0].path}})
            
        } catch (error) {
            res.status(201).json({message:'update user profile ...'})
        }
    } catch (error) {
        res.status(500).json({message:'search user faild ...'})
    }
}

exports.Show_All_Users=Show_All_Users
exports.Show_UserBy_Id=Show_UserBy_Id
exports.Check_User=Check_User
exports.Show_User_LikeList=Show_User_LikeList
exports.CheckLogin_Users=CheckLogin_Users
exports.Create_User=Create_User
exports.ChangeProfileImage=ChangeProfileImage