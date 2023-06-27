require('dotenv').config();
var SibApiV3Sdk = require('sib-api-v3-sdk');
const path=require('path');
const { v4: uuidv4 } = require('uuid');
const User=require('../models/user');
const Forgotpasswordrequest=require('../models/forgotpasswordrequest');
const sequelize=require('../utils/database');
const bcrypt=require('bcrypt');
const saltRounds=Number(process.env.SALT_ROUNDS);


exports.getForgotPasswordPage=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','forgotpassword.html'));
}


exports.postForgotPassword=async (req,res,next)=>{

    const t = await sequelize.transaction();
    try{

        console.log(req.body.email)
        const email=req.body.email;
        const api_key=process.env.SIB_API_KEY;
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = api_key;
        const tranEmailApi=new SibApiV3Sdk.TransactionalEmailsApi();
        

        const uid=uuidv4();
        //console.log(uid)
        const userToReset=await User.findAll({where:{email:email}})

        if(userToReset.length>0)
        {
           // console.log(userToReset)
           await userToReset[0].createForgotpasswordrequest({id:uid,isActive:true},{ transaction: t });
        }
        else
        {
            throw "User Not Registered"
        }
        const link='http://localhost:3300/resetpassword/'+uid;


        const sender={
            email:"arfin786khan@gmail.com",
            name:"Arfinzz"
        }

        const receivers=[
            {
                email:email
            }
        ]


        const result=await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject:'Reset password',
            textContent:`Click on the link to reset your password : ${link}`
            })

        console.log(result);
        await t.commit();
        return res.status(200).json({message:"Password reset link sent successfully"});
    }catch(err)
        {
                await t.rollback();
                console.log(err);
                return res.status(500).json(err);
        }
       
}


exports.getResetPassword=async (req,res,next)=>{
   
    try{

        const uid=req.params.uid;
        const fpreq=await Forgotpasswordrequest.findAll({where:{id:uid}});
        if(fpreq.length>0 && fpreq[0].isActive)
        {
            return res.sendFile(path.join(__dirname,'../','views','resetpassword.html'))
        }
        else
        {
            throw 'Link Not Valid';
        }
        

    }
    catch(err)
    {
        return res.status(500).json(err);
    }
   

}


exports.postResetPassword=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{

        const uid=req.params.uid;
        const password=req.body.password;
        //console.log(password);
        

        const fpreq=await Forgotpasswordrequest.findAll({where:{id:uid}});
        if(fpreq.length>0 && fpreq[0].isActive)
        {
            await fpreq[0].update({isActive:false},{transaction:t});
            const encryptedPassword=await bcrypt.hash(password,saltRounds);
            const user=await User.findAll({where:{id:fpreq[0].userId}});
            await user[0].update({password:encryptedPassword},{transaction:t});
            t.commit();
            return res.status(200).json({message:"Password reset successfull"});
        }
        else
        {
            throw 'Link Not Valid';
        }
        

    }
    catch(err)
    {
        t.rollback();
        return res.status(500).json(err);
    }
 
 }
