const Task = require('../Models/Task')

const Show_All_List = async(req,res,next)=>{
    let task
    try {
        task= await Task.find({})
        if(!task){
            res.status(422).json({message: 'empty ...'})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:task,message:'show task ....'})
}
const Add_items = async(req,res,next)=>{
    const title=req.body.title
    console.log(req.body.title)
    try {
        const createTask= new Task({
            title:title,
            state:'wait'
        })
        let Addtask= await createTask.save()
        res.status(200).json({data:Addtask,message:'add task ...'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}
const Update_List =async(req,res,next)=>{
    const {id,state}=req.body
    try {
        let Updatetask= await Task.updateOne({_id:id} , {"$set":{"state":state}})
        res.status(200).json({data:Updatetask,message:'update task ...'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const Delete_Item =async(req,res,next)=>{
    const id=req.body.id
    try {
        let Deletetask= await Task.remove({_id:id})
        res.status(200).json({data:Deletetask,message:'Delete task ...'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

exports.Show_All_List =Show_All_List
exports.Add_items = Add_items
exports.Update_List = Update_List
exports.Delete_Item = Delete_Item