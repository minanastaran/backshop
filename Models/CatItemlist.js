const mongoose=require('mongoose');
const CatItemSchema=mongoose.Schema({
    _id:String,
    cat:{
        type:String,
        ref:'Cat'
    }
})
module.exports=mongoose.model('CatItem',CatItemSchema)