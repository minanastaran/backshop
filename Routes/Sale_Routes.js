const express=require('express')
const router=express.Router()

// const Order = require('../Models/Order')
// const OrderItem = require('../Models/OrderItem')

const Sale_Controllrs= require('../Controllers/Sale_Controllrs')

router.post('/checkbagstate',Sale_Controllrs.Check_Bag_State)
router.post('/createOrder',Sale_Controllrs.Create_Order)
router.post('/createOrderItem',Sale_Controllrs.Create_OrderItem)
router.post('/createinvice',Sale_Controllrs.Check_Product_Exist)
router.post('/lastinvoice',Sale_Controllrs.Delete_Last_Invoice)

router.post('/Add',Sale_Controllrs.Add_New_Sale)
router.post('/showorder',Sale_Controllrs.Show_Order_ById)
router.post('/deleteOrderitem',Sale_Controllrs.Delete_OrderItem)
router.post('/invoice',Sale_Controllrs.Add_Invoice)
router.post('/myinvoice',Sale_Controllrs.Show_My_Invoice)
router.post('/deleteInvoice',Sale_Controllrs.Delete_My_Invoice)
router.post('/addfactor',Sale_Controllrs.Add_Factor)

module.exports=router