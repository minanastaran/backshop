const mongoose=require('mongoose')
const OrderItemShema=mongoose.Schema({
    Order:{ //factor id
        type:mongoose.Types.ObjectId,
        ref:'Order'
    },
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    count:Number,
    price:Number,
    date:Date
})
module.exports=mongoose.model('OrderItem',OrderItemShema)