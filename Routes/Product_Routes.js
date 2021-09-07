const express=require('express')
const router=express.Router()
const {check}=require('express-validator')
const Product_FileUpload = require('../Util/Product_FileUpload')

//import 
const Product_Controllers =require('../Controllers/Product_Controllers')

//api
router.get('/',Product_Controllers.Show_All_Products)
router.post('/searchbycat',Product_Controllers.Show_Products_ByCat)
router.post('/searchbycatitem',Product_Controllers.Show_Products_ByCatItem)
router.get('/profile/:userid',Product_Controllers.Show_User_Product)
router.get('/:id',Product_Controllers.Show_Detail_Product)
router.post('/Add',Product_FileUpload.array('image',10),
[
    check('title').not().isEmpty(),                  //require
    check('price').notEmpty().isLength({min:4})     //minsize
],
Product_Controllers.Create_Product)
router.delete('/Delete',Product_Controllers.Delete_Product)
router.post('/Edit',Product_FileUpload.array('image',6),Product_Controllers.Edit_Product)
router.post('/addlike',Product_Controllers.AddLike)
router.post('/dislike',Product_Controllers.DisLike)


module.exports=router