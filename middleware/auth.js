const User=require('../models/user');
const jwt = require('jsonwebtoken');
const privateKey="nushany3566327XNG427878CNYRYEWGGTHU3UY784T3";

exports.authenticate=async (req,res,next)=>{
    try{
        const token=req.headers.authorization;
        //console.log("his req",req.headers)
        const user=jwt.verify(token,privateKey);
         //console.log(user);
        const loggedinUser=await User.findByPk(user.id);
        //console.log(JSON.stringify(loggedinUser));
         req.user=loggedinUser;
        next();

    }catch(err)
    {
        return res.status(401).json({message:"User Nottt Authorized"});
    }
    
}