require('dotenv').config();
const sequelize=require('../utils/database');

const Razorpay=require('razorpay');

exports.buyPremium=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        var rzp=new Razorpay({
            key_id:process.env.key_id,
            key_secret:process.env.key_secret
        })
        const amount=2500;

        rzp.orders.create({amount,currency:"INR"},async (err,order)=>{
            if(err)
            {
                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({orderid:order.id,status:"PENDING"},{transaction: t});
            await t.commit();
            return res.status(201).json({order,key_id:rzp.key_id});
        })
    }
    catch(err)
    {
        await t.rollback();
        console.log(err);
        return res.status(403).json(err);
    }
    
}

exports.premiumSuccess=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const payment_id=req.body.payment_id;
        const order_id=req.body.order_id
        //console.log(req.body)
        const orderToUpdate=await req.user.getOrders({where:{orderid:order_id}});
        const p1= orderToUpdate[0].update({paymentid:payment_id,status:"SUCCESS"},{transaction: t});
        const p2= req.user.update({ispremium:true},{transaction: t});
        await Promise.all([p1,p2]);
        await t.commit();
        return res.status(200).json({"message":"Payment Successfull"});
    }
    catch(err)
    {
        await t.rollback();
        console.log(err);
        return res.status(403).json(err);
    }
    
}

exports.premiumFailed=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const payment_id=req.body.payment_id;
        const order_id=req.body.order_id
        //console.log(">>>>> FAILED PAYMENT")
        //console.log(req.body)
        const orderToUpdate=await req.user.getOrders({where:{orderid:order_id}});
        await orderToUpdate[0].update({paymentid:payment_id,status:"FAILED"},{transaction: t});
        await t.commit();
        return res.status(200).json({"message":"Payment Failed"});
    }
    catch(err)
    {
        await t.rollback();
        console.log(err);
        return res.status(403).json(err);
    }
    
}