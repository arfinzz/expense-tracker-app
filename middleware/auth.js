const User=require('../models/user');
const jwt = require('jsonwebtoken');
const privateKey="nushany3566327XNG427878CNYRYEWGGTHU3UY784T3";

exports.user=async (req,res,next)=>{
    try{
        const token=req.headers.authorization;
        //console.log("his req",req.headers)
        const user=jwt.verify(token,privateKey);
         //console.log(user);
        const loggedinUser=await User.findByPk(user.id);
        //console.log(JSON.stringify(loggedinUser));
        if(!loggedinUser)
        throw 'Error'
         req.user=loggedinUser;
        next();

    }catch(err)
    {
        return res.status(401).json({message:"User Not Authorized"});
    }
    
}

exports.premium=async (req,res,next)=>{
    try{
        const token=req.headers.authorization;
        if(!token)
        {
            throw "Please login";
        }
        
        //verify token
        const user=jwt.verify(token,privateKey);
         
        //get user from database
        const loggedinUser=await User.findByPk(user.id);
        
        //if no such user in database
        if(!loggedinUser)
        {
            throw "Please login";
        }
        
        //check if user is premium
        if(loggedinUser.ispremium==true)
        {
            req.user=loggedinUser;
            //console.log("authenticated")
        }
        else{
            throw "Please buy premium";
        }
        
        next();

    }catch(err)
    {
        return res.status(401).json({"message":err});
    }
    
}