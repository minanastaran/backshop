const Order = require('../Models/Order')
const OrderItem = require('../Models/OrderItem')
const Product = require('../Models/Product')

// const error = new HttpError('Creating Post Failed!', 500)
// return next(error)

const Add_New_Sale=async(req,res,next)=>{
    let {userId,productId,count,price} = req.body
    let total_price=count*price
    
    const new_order= new Order ({
        userId:userId,
        totalprice:0,
        date:new Date(),
        updatedate:new Date(),
        state:'await',
        orderItems:[]
    })
    

    let check_order
    let addorderitem

    try {
        check_order= await Order.findOne({userId:userId , state:'await'})
        if(!check_order){
            try {
                check_order = await new_order.save()
            } catch (error) {
                res.status(201).json({data:'create new order ...'})
            }
        }
        const order_item= new OrderItem ({
            Order:check_order._id,
            productId:productId,
            count:count,
            price:count*price,
            date:new Date()
        })
        try {
            addorderitem = await order_item.save()
            let totalprice_=check_order.totalprice+(count*price)
            await Order.updateOne({_id:check_order._id} , {"$set":{totalprice:totalprice_},"$push": { orderItems:addorderitem._id }})
                res.status(201).json({data:'create new order & order item ...'})
            
        } catch (error) {
            res.status(500).json({error: error})
        }
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Show_Order_ById=async(req,res,next)=>{
    let userId = req.body.userid
    let userorder
    try {
        userorder = await Order.findOne({userId:userId , state:'await'}).populate({
            path : 'orderItems',
            populate : {
              path : 'productId'
            }
          })

        res.status(200).json({data:userorder})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Delete_OrderItem=async(req,res,next)=>{
    let {orderId ,orderitemId , price}=req.body
    let result_order
    let result_orderitem
    try {
        result_order = await Order.updateOne({_id:orderId}, {$pull:{orderItems:orderitemId} , $set:{totalprice:price}})
            try {
                result_orderitem= await OrderItem.remove({_id:orderitemId});
                res.status(200).json({data:result_orderitem,message:'remore orderitem'})
            } catch (error) {
                res.status(500).json({error: error})
            }
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Add_Invoice=async(req,res,next)=>{
    let {userid,orderid,order}=req.body
    let orderitems=order.orderItems
    let checkexist
    let freeproduct
    let soldlist=[]
    let newprice =order.totalprice
    
        try {
            for (let i = 0; i < orderitems.length; i++) {
                checkexist = await Product.findOne({_id:orderitems[i].productId._id , state:'exist'})
                if(!checkexist){
                    soldlist.push(orderitems[i].productId.title)
                    try {
                        newprice= newprice - orderitems[i].price
                        await Order.updateOne({_id:orderid} ,{$pull: {orderItems:orderitems[i]._id} , $set:{totalprice:newprice}})
                            try {
                                await OrderItem.deleteOne({_id:orderitems[i]._id})   
                            } catch (error) {
                                // res.status(500).json({error: error})
                            }
                    } catch (error) {
                        // res.status(500).json({error: error})
                    }
                }
                else{
                    // kasr mojodi 
                    if(checkexist.count>=2){
                        console.log("sold")
                        await Product.updateOne({_id:checkexist._id} , {$set:{ count:checkexist.count-1 , sold_count:checkexist.sold_count+1}})
                        
                    }
                    else{
                        console.log("rez")
                        await Product.updateOne({_id:checkexist._id} , {$set:{ count:checkexist.count-1 , sold_count:checkexist.sold_count+1 , state:'await'}})
                       
                    }
                }
            }
            
            await Order.updateOne({_id:orderid} ,{$set:{state:'rez' , updatedate:new Date()}}) 
            res.status(200).json({data:checkexist, message:soldlist })
        } catch (error) {
            res.status(500).json({error: error})
        }
}

const Show_My_Invoice=async(req,res,next)=>{
    let userId = req.body.userId
    try {
        userorder = await Order.findOne({userId:userId , state:'rez'}).sort({ $natural: -1 }).populate({
            path : 'orderItems',
            populate : {
              path : 'productId'
            }
          })

        res.status(200).json({data:userorder})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Delete_My_Invoice=async(req,res,next)=>{
    let {orderId} = req.body
    let find_order
    let result_orderitem
    try {
        find_order = await Order.findOne({_id:orderId}).populate({
            path : 'orderItems',
            populate : {
              path : 'productId'
            }
          })
        for (let i = 0; i < find_order.orderItems.length; i++) {
            await Product.updateOne(
                {_id:find_order.orderItems[i].productId},
                {$set:{count:find_order.orderItems[i].productId.count+1,
                    sold_count:find_order.orderItems[i].productId.sold_count-1,
                    state:'exist'}});
            await OrderItem.remove({_id:find_order.orderItems[i]})
            await Order.remove({_id:orderId})
        }
        res.status(200).json({message:'Delet'})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Add_Factor=async(req,res,next)=>{
    let orderId=req.body.orderId
    let result
    let check_product
    try {
        await Order.updateOne({_id:orderId},{$set:{state:'sabt'}})
    } catch (error) {
        
    }
    try {
        check_product = await Order.findOne({_id:orderId}).populate({
            path : 'orderItems',
            populate : {
              path : 'productId'
            }
          })
        result = check_product.orderItems.filter(item => item.productId.state === 'await')
        if(result){
            for (let i = 0; i < result.length; i++) {
                await Product.updateOne({_id:result[i].productId._id},{$set:{state:'finish'}})
            }
        }
    } catch (error) {
        res.status(500).json({error: error})
    }

    res.status(200).json({message:'add factor ...'})
}

/*-------------------------------------------------------------------------*/

const Check_Bag_State=async(req,res,next)=>{
    let userId=req.body.userId
    let result
    try {
        result=await Order.findOne({userId:userId , state:'await'})
    } catch (error) {
        res.status(500).json({error: error})
    }
    res.status(200).json(result)
}

const Create_Order=async(req,res,next)=>{
    let userId = req.body.userId
    let neworder

    const new_order= new Order ({
        userId:userId,
        totalprice:0,
        date:new Date(),
        updatedate:new Date(),
        state:'await',
        orderItems:[]
    })
    try {
        neworder = await new_order.save()
    } catch (error) {
        res.status(500).json({error: error})
    }
    res.status(201).json({data:neworder})
}

const Check_Product_Exist=async(req,res,next)=>{
    let orderitems=req.body.orderitems
    let orderid=orderitems[0].Order
    let checkexist
    let result
    let totalprice=0
    let orderitemsList=[]
    let soldlist=[]
    let existlist=[]
    // console.log(orderitems)
    
    try {
        for (let i = 0; i < orderitems.length; i++) {
            checkexist = await Product.findOne({_id:orderitems[i].productid , state:'exist'})
            // console.log(checkexisst + " < ----- exist -------")
            // console.log(checkexist + " <<<<")
            if(!checkexist){
                soldlist.push(orderitems[i])
            }
            else{
                // kasr mojodi 
                if(checkexist.count>=2){
                    // console.log("sold")
                    await Product.updateOne({_id:checkexist._id} , {$set:{ count:checkexist.count-1 , sold_count:checkexist.sold_count+1}})
                    
                }
                else{
                    // console.log("rez")
                    await Product.updateOne({_id:checkexist._id} , {$set:{ count:checkexist.count-1 , sold_count:checkexist.sold_count+1 , state:'await'}})
                   
                }

                //update orderitem
                let new_orderitem= new OrderItem ({
                    Order:orderitems[i].Order,
                    productId:orderitems[i].productid,
                    count:orderitems[i].count,
                    price:orderitems[i].price,
                    date:orderitems[i].date
                })
                
                let createorderitem = await new_orderitem.save()
                // console.log(" create orderitem >>>" + createorderitem)

                totalprice= totalprice + orderitems[i].price
                existlist.push(orderitems[i])
                orderitemsList.push(createorderitem._id)
                    // console.log(" list of orderitem >>>" + orderitemsList)
            }
        }
        try {
            result = await Order.updateOne(
                {_id:orderid} ,
                {
                    $set:{state:'rez' , updatedate:new Date() , totalprice:totalprice} , 
                    $push:{orderItems:orderitemsList}
                }
            ) 
        } catch (error) {
            console.log(error)
        }

        res.status(200).json({data:result, message:{sold:soldlist,exist:existlist}})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Delete_Last_Invoice=async(req,res,next)=>{
    let userId=req.body.userId
    let result
    let time= new Date()

    try {
        result=await Order.find({userId:userId , state:'rez'})
        let nowtime=new Date()
        for(i in result){
            // console.log(new Date()-result[i].updatedate)
            let diff=nowtime-result[i].updatedate
            console.log(result[i].updatedate + " == " +diff/60000+" == " + nowtime)
        }
        res.status(200).json({data:result})
    } catch (error) {
        res.status(500).json({error: error})
    }
}

const Create_OrderItem=async(req,res,next)=>{
}



exports.Check_Bag_State=Check_Bag_State
exports.Create_Order=Create_Order
exports.Create_OrderItem=Create_OrderItem
exports.Check_Product_Exist=Check_Product_Exist
exports.Delete_Last_Invoice=Delete_Last_Invoice
// exports.Decrement_Product=Decrement_Product

exports.Add_New_Sale=Add_New_Sale
exports.Show_Order_ById=Show_Order_ById
exports.Delete_OrderItem=Delete_OrderItem
exports.Add_Invoice=Add_Invoice
exports.Show_My_Invoice=Show_My_Invoice
exports.Delete_My_Invoice=Delete_My_Invoice
exports.Add_Factor=Add_Factor