const mongoose=require('mongoose');
const CatSchema=mongoose.Schema({
    _id:String
})
module.exports=mongoose.model('Cat',CatSchema)