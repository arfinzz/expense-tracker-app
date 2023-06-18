const User=require('../models/user');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize=require('../utils/database');

const saltRounds=10;
const privateKey="nushany3566327XNG427878CNYRYEWGGTHU3UY784T3";

function isNotValid(str)
{
    if(str && str.length>0)
        return false;
    return true;
}

exports.getLogin=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','home.html'));
}

exports.getSignup=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','signup.html'));
}

exports.postSignup=async (req,res,next)=>{
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;
    const t = await sequelize.transaction();
    if(isNotValid(email) || isNotValid(name) || isNotValid(password))
    {
        return res.status(400).json({message:"Invaid details"});
    }
    
    try{
        const encryptedPassword=await bcrypt.hash(password,saltRounds);
        const userData={
            email:email,
            name:name,
            password:encryptedPassword
        }
        const userWithEmail=await User.findAll({
            where:{
                email:email
            }
        });
        if(userWithEmail.length>0)
        {
           return res.status(400).json({message:"Email Already Exist"});
        }
        else{
            const newUser=await User.create(userData,{ transaction: t }); 
            //console.log(newUser);
            await t.commit();
            return res.status(201).json({message:"Account Created"});
        }
    }catch(err){
        console.log(err);
        await t.rollback();
        return res.status(500).json(err);
    }
    

}


exports.postLogin=async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    //console.group(email,password);
    if(isNotValid(email) || isNotValid(password))
    {
        return res.status(400).json({message:"Invaid details"});
    }
    
    try{

        const userWithEmail=await User.findAll({where:{
            email:email
        }});
        //console.log(userWithEmail)

        if(userWithEmail.length>0)
        {
            const passwordMatched=await bcrypt.compare(password,userWithEmail[0].password);
            if(passwordMatched)
            {
                const token = jwt.sign({ id: userWithEmail[0].id , email:userWithEmail[0].email }, privateKey);
                //console.log(token);
                return res.status(200).json({message:"User Login Successfull",token:token});
            }
            else
            {
                return res.status(401).json({message:"User Not Authorized"});
            }
        }
        else
        {

            return res.status(404).json({message:"User Not Found"});

        }
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
    

}