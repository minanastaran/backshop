const express=require('express')
const router=express.Router()
const {check}=require('express-validator')
const fileUpload =require('../Util/FileUpload')
const multer = require('multer')

const User =require('../Models/User')

//import
const User_Controllrs=require('../Controllers/User_Controllers')


//api
router.get('/',User_Controllrs.Show_All_Users)
router.get('/:uid',User_Controllrs.Show_UserBy_Id)
router.post('/checkuser',User_Controllrs.Check_User)
router.get('/mylikelist/:uid',User_Controllrs.Show_User_LikeList)
router.post('/login',User_Controllrs.CheckLogin_Users)
router.post('/register', 
fileUpload.single('image'),
[
    check('id')
        .not()
        .isEmpty(),
    check('password')
        .isLength({ min: 6 })
],
User_Controllrs.Create_User)
router.post('/profileimage',fileUpload.array('image',1),User_Controllrs.ChangeProfileImage)


module.exports=router
