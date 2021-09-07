const Cat =require('../Models/Catlist')
const CatItem =require('../Models/CatItemlist')



const show_CatList =async(req,res,next)=>{
    let showallcats
    try {
        showallcats = await Cat.find({})//.exect()
        if(!showallcats){
            res.status(422).json({message: 'empty cat list ...'})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:showallcats})
}

const Add_CatList=async(req,res,next)=>{
    const title=req.body.title

    let existcat
    let newcat

    const createCat=new Cat({
        _id:title
    })

    try {
        existcat = await Cat.findOne({"_id":title})
        if(existcat){
            res.status(422).json({message:" later add this cat  ..."})
        }
        try {
            newcat=await createCat.save()
        } catch (error) {
            res.status(500).json({error:error})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(201).json({data:newcat,message:'Add Cat ...'})
    
}

const show_CatItemList =async(req,res,next)=>{
    let showallcatitem
    try {
        showallcatitem = await CatItem.find({}).populate('cat')//.exect()
        if(!showallcatitem){
            res.status(422).json({message: 'empty catitem list ...'})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:showallcatitem})
}

const Add_CatItemList=async(req,res,next)=>{
    const {title , catid}=req.body
    let existcatitem
    let newcatitem

    console.log(title+" - "+catid);

    const createCatitem=new CatItem({
        _id:title,
        cat:catid
    })

    try {
        existcatitem = await CatItem.findOne({"_id":title})
        if(existcatitem){
            res.status(422).json({message:" later add this catitem  ..."})
        }
        try {
            newcatitem=await createCatitem.save()
        } catch (error) {
            res.status(500).json({error:error})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:newcatitem,message:'Add Cat ...'})
}

const CatitemList_byCatId =async(req,res,next)=>{
    let catid = req.params.catid
    console.log(catid);
    let catitemlist
    try {
        catitemlist = await CatItem.find({'cat':catid})//.exect()
        // if(!showallcats){
        //     res.status(422).json({message: 'empty cat list ...'})
        // }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({data:catitemlist})
}

exports.show_CatList=show_CatList
exports.Add_CatList=Add_CatList
exports.show_CatItemList=show_CatItemList
exports.Add_CatItemList=Add_CatItemList
exports.CatitemList_byCatId=CatitemList_byCatId