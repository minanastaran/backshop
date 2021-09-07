const express=require('express')
const router=express.Router()

const Manage_Controllers=require('../Controllers/Manage_Controllers')

//api
router.get('/showcats',Manage_Controllers.show_CatList)
router.get('/showcatitems',Manage_Controllers.show_CatItemList)
router.post('/addcat',Manage_Controllers.Add_CatList)
router.post('/addcatitem',Manage_Controllers.Add_CatItemList)
router.get('/:catid',Manage_Controllers.CatitemList_byCatId)

module.exports=router