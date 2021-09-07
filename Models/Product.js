const mongoose=require('mongoose');
const ProductSchema=mongoose.Schema({
    // _id:String,
    title:String,
    desc:String,
    price:Number,
    sold_price:Number,
    count:Number,
    sold_count:Number,
    gallery:Array,
    image:Array,
    cat:String,
    catitem:String,
    time:String,
    like:Number,
    cat:{
        type:String,
        ref:'Cat'
    },
    catitem:{
        type:String,
        ref:'CatItem'
    },
    // creator:String
    creator:{
        type:String, 
        ref:'User'
    },
    state:String    //exist,await,finish

})
module.exports=mongoose.model('Product',ProductSchema)