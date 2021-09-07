const mongoose=require('mongoose');
const UserSchema=mongoose.Schema({
    _id:String,     //Phone Number
    name:String,
    password:String,
    profile:Array,
    like:[{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    }],
    products:[{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    }]
})
module.exports=mongoose.model('User',UserSchema)