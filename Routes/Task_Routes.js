const express=require('express')
const router=express.Router()

const Task_Controllers = require('../Controllers/Task_Controllers')

router.get('/',Task_Controllers.Show_All_List)
router.post('/Add',Task_Controllers.Add_items)
router.post('/update',Task_Controllers.Update_List)
router.delete('/Delete',Task_Controllers.Delete_Item)

module.exports=router