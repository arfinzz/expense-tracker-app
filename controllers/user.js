const User=require('../models/user');
const path=require('path');

function isNotValid(str)
{
    if(str && str.length>0)
        return false;
    return true;
}

exports.getLogin=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','login.html'));
}

exports.getSignup=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','signup.html'));
}

exports.postSignup=async (req,res,next)=>{
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;
    if(isNotValid(email) || isNotValid(name) || isNotValid(password))
    {
        return res.status(400).send({"output":"Invaid details"});
    }
    const userData={
        email:email,
        name:name,
        password:password
    }
    try{
        const userWithEmail=await User.findAll({
            where:{
                email:email
            }
        });
        if(userWithEmail.length>0)
        {
           return res.status(400).send({"output":"Email Already Exist"});
        }
        else{
            await User.create(userData);
            return res.status(201).send({"output":"Account Created"});
        }
    }catch(err){
        console.log(err);
    }
    

}


exports.postLogin=async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    if(isNotValid(email) || isNotValid(password))
    {
        return res.status(400).send({"output":"Invaid details"});
    }
    
    try{

        const userWithEmail=await User.findAll({where:{
            email:email
        }});

        if(userWithEmail.length>0)
        {
            const user=await User.findAll({
                where:{
                    email:email,
                    password:password
                }
            });

            if(user.length>0)
            {
                return res.status(200).send({"output":"User Login Successfull"});
            }
            else
            {
                return res.status(401).send({"output":"User Not Authorized"});
            }
        }
        else
        {

            return res.status(404).send({"output":"User Not Found"});

        }
    }catch(err){
        console.log(err);
    }
    

}