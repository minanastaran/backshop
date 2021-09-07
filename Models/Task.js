const mongoose=require('mongoose');

const TaskSchema=mongoose.Schema({
    title:String,
    state:String, //done,wait,delete
})
module.exports=mongoose.model('Task',TaskSchema)