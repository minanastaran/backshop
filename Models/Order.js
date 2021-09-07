const mongoose=require('mongoose');
const OrderSchema=mongoose.Schema({
    userId:{
        type:String ,
        ref:'User'
    },
    totalprice:Number,
    date:Date,
    updatedate:Date,
    state:String,   // await , rez , sabt
    orderItems:[{
        type:mongoose.Types.ObjectId,
        ref:'OrderItem'
    }]
})
module.exports=mongoose.model('Order',OrderSchema)