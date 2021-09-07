const HttpError =require('../Util/HttpError')
const {validationResult}=require('express-validator')
const Product=require('../Models/Product')
const User=require('../Models/User')
const fs=require('fs')
const sharp = require('sharp');
const { findOne } = require('../Models/Product')

// const uniqid = require('uniqid');

const Show_All_Products = async(req,res,next)=>{
    let all_products
    try {
        all_products = await Product.find({state:'exist'}).sort({ $natural: -1 })//.exect()
        if(!all_products){
            res.status(422).json({message: 'empty ...'})
        }
        res.status(200).json({data:all_products,message:'Show All Products ...'})
    } catch (error) {
        res.status(500).json({error:error})
    }
}

const Show_Detail_Product = async(req,res,next)=>{
    const product_id = req.params.id
    let find_product
    try {
        find_product=await Product.findById(product_id).populate('cat').populate('catitem')
        if(!find_product){
            res.status(422).json({message:" not find ..."})
        }
        res.status(200).json({data:find_product.toObject({getters:true}),message:'Show Details ...'})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Show_User_Product=async(req,res,next)=>{
    const userid=req.params.userid
    let product

    try {
        product = await Product.find({ creator: userid }).populate('cat').populate('catitem')
        if (!product) {
            res.status(422).json({data: 'Could not find a post'})
        }
        res.status(200).json({ data: product})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Create_Product=async(req,res,next)=>{
    
    const error = validationResult(req)
    if(!error.isEmpty()){
        res.status(422).json({message: " Invalid datas"})
    }

    if (!req.files) {
        res.status(200).json({'msg':"no file avilable!"})
    }
    let result
    let find_user
    let products_gallery=[]
    const files = req.files;

    const {title, desc , price,sold_price,count,cat,catitem,creator}=req.body

    for (let i = 1; i < files.length; i++) {
        products_gallery.push(files[i].path)
    }

    //----------------------------------------------
    // const { filename: image } = files[0].path;
    // await sharp(files[0].path)
    // .resize(200, 200)
    // .jpeg({ quality: 90 })
    // .toFile(
    //     path.resolve(files[0].destination,'resized',image)
    //     )
    // fs.unlinkSync(files[0].path)
    //----------------------------------------------

    const new_product= new Product({
        title:title,
        desc:desc,
        price:price,
        sold_price:sold_price,
        count:count,
        sold_count:'0',
        gallery:products_gallery,
        image:files[0].path,
        cat:cat,
        catitem:catitem,
        time:new Date(),
        like:0,
        cat:cat,
        catitem:catitem,
        creator:creator,
        state:'exist',
    })
    try {
        find_user=await User.findById(creator)
        if(!find_user){
            res.status(422).json({message:" creator in not valid ..."})
        }
        else{
            try {
                result = await new_product.save()
                find_user.products.push(new_product)
                await find_user.save()
                res.status(201).json({data:result,message:"Add Product ..."})
            } catch (error) {
                res.status(500).json({error: error})
            }
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
}

const Delete_Product =async(req,res,next)=>{
    const delete_by_id = req.body.id
    let remove_product
    try {
        remove_product= await Product.findById(delete_by_id).populate('creator')
        console.log(remove_product)
        try {
            await remove_product.remove() //{_id:delete_by_id}
            remove_product.creator.products.pull(remove_product)
            await remove_product.creator.save()
            if (remove_product.image) {
                for(let i=0 ; i<remove_product.image.length ; i++){
            fs.unlink(remove_product.image[i], (err) => {
                console.log(err)
            })
        }
            }
        } catch (error) {
            res.status(500).json({error: error})
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
    res.status(200).json({message:"Delete product ..."})
}

const Edit_Product=async(req,res,next)=>{
    const {id,name,desc,price,image}=req.body
    let find_product
    let products_imgs=[]
    const files = req.files;

    //delete last photo
    find_product= await Product.findOne({"_id":id})
    for(let i=0 ; i<find_product.image.length ; i++){
        fs.unlink(find_product.image[i], (err) => {
            console.log(err)
        })
    }

    //new photo
    for (let i = 0; i < files.length; i++) {
        products_imgs.push(files[i].path)
    }
  
    Product.updateOne({_id:id} , {"$set":{"name":name , "desc":desc ,"price":price,"image":products_imgs}})
    .then(result => {
        res.status(200).json(result)
    }).catch(error => {
        res.status(500).json({error: error})
    })
}

const AddLike =async(req,res,next)=>{
    let {productid,userid,count}=req.body

    User.updateOne({_id:userid},{ "$push": { like:productid }})
    .then(result=>{
        // res.status(200).json(result)
            Product.updateOne({_id:productid},{"$set":{"like":count}})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(error=>{
            res.status(500).json({error: error})
        })
    })
    .catch(error=>{
        res.status(500).json({error: error})
    })

}
const DisLike =async(req,res,next)=>{
    let {productid,userid,count}=req.body

    User.updateOne({_id:userid},{ "$pull": { like:productid }})
    .then(result=>{
        // res.status(200).json(result)
            Product.updateOne({_id:productid},{"$set":{"like":count}})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(error=>{
            res.status(500).json({error: error})
        })
    })
    .catch(error=>{
        res.status(500).json({error: error})
    })
}


const Show_Products_ByCat =async(req,res,next)=>{
    let cat = req.body.cat
    let findProducts
    try {
        findProducts=await Product.find({'cat':cat}).sort({ $natural: -1 })
    } catch (error) {
        res.status(500).json({error: error})
    }
    res.status(200).json({data:findProducts,message:'find product by cat ...'})
}

const Show_Products_ByCatItem =async(req,res,next)=>{
    let catitem = req.body.catitem
    let findProducts

    try {
        findProducts=await Product.find({'catitem':catitem}).sort({ $natural: -1 })
    } catch (error) {
        res.status(500).json({error: error})
    }
    res.status(200).json({data:findProducts,message:'find product by catitem ...'})
}

//export 
exports.Show_All_Products=Show_All_Products
exports.Show_Detail_Product=Show_Detail_Product
exports.Show_User_Product=Show_User_Product
exports.Create_Product=Create_Product
exports.Delete_Product=Delete_Product 
exports.Edit_Product=Edit_Product 
exports.AddLike=AddLike
exports.DisLike=DisLike
exports.Show_Products_ByCat=Show_Products_ByCat
exports.Show_Products_ByCatItem=Show_Products_ByCatItem
