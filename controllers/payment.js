require('dotenv').config();
const Razorpay=require('razorpay');

exports.payment=async (req,res,next)=>{
    try{
        var rzp=new Razorpay({
            key_id:process.env.key_id,
            key_secret:process.env.key_secret
        })
        const amount=2500;

        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err)
            {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid:order.id,status:"PENDING"})
            .then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id});
            })
            .catch(err=>{
                throw new Error(err);
            });



        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json(err);
    }
    
}

exports.updateUser=async (req,res,next)=>{
    try{
        const payment_id=req.body.payment_id;
        const order_id=req.body.order_id
        //console.log(req.body)
        const orderToUpdate=await req.user.getOrders({where:{orderid:order_id}});
        const p1= orderToUpdate[0].update({paymentid:payment_id,status:"SUCCESS"});
        const p2= req.user.update({ispremium:true});
        await Promise.all([p1,p2]);
        return res.status(200).json({"dws":"ewfwe"});
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json(err);
    }
    
}

exports.failedPayment=async (req,res,next)=>{
    try{
        const payment_id=req.body.payment_id;
        const order_id=req.body.order_id
        //console.log(">>>>> FAILED PAYMENT")
        //console.log(req.body)
        const orderToUpdate=await req.user.getOrders({where:{orderid:order_id}});
        await orderToUpdate[0].update({paymentid:payment_id,status:"FAILED"});
        await orderToUpdate[0].save();
        return res.status(200).json({"dws":"ewfwe"});
    }
    catch(err)
    {
        console.log(err);
        return res.status(403).json(err);
    }
    
}