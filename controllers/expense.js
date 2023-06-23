const User=require('../models/user');
const path=require('path');
const sequelize=require('../utils/database');
const AWS=require('aws-sdk');
require('dotenv').config();
const axios=require('axios')

function isNotValid(str)
{
    if(str && str.length>0)
        return false;
    return true;
}

exports.displayUserHome=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','user-home.html'));
}

exports.addExpense=async (req,res,next)=>{
    const expenseAmount=req.body.expenseAmount;
    const description=req.body.description;
    const category=req.body.category;
    const t = await sequelize.transaction();
    if(isNotValid(expenseAmount) || isNotValid(description) || isNotValid(category))
    {
        return res.status(400).json({message:"Invaid details"});
    }
    
    try{
       await req.user.createExpense({expenseAmount:expenseAmount,description:description,category:category},{transaction: t});
       const oldExpense=req.user.totalExpense;
       const newExpense=oldExpense + + expenseAmount;
       await req.user.update({totalExpense:newExpense},{transaction: t});
       await t.commit();
       return res.status(200).json({message:"Expense created successfully"});
        
    }catch(err){
        console.log(err);
        await t.rollback();
        return res.status(500).json(err);
    }
}


exports.getExpense=async (req,res,next)=>{
    try{
        const pageNo=req.headers.pageno;
        //console.log(req.headers)
        const rowsPerPage=req.headers.rowsperpage;
        //console.log(pageNo)
        const limit=Number(rowsPerPage);
        const totalExpenses=await req.user.countExpenses();
        const totalPages=Math.ceil(totalExpenses/limit);
        //console.log(total)
        const offset=(pageNo-1)*limit;
        const exp=await req.user.getExpenses({ offset: offset, limit: limit });
        //console.log(exp);
        const hasPrevious=offset!=0;
        const hasNext=offset+limit<totalExpenses;
        const hasStart=pageNo==1 || pageNo==2;
        const hasEnd=pageNo==totalPages || pageNo==totalPages-1;
        const ispremium=req.user.ispremium==true;
        const pageData={
            hasNext:hasNext,
            hasPrevious:hasPrevious,
            hasStart:hasStart,
            hasEnd:hasEnd,
            totalPages:totalPages
        }
        return res.status(200).json({expense:exp,ispremium:ispremium,pageData:pageData});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}


exports.deleteExpense=async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const id=req.params.id;
        const expenseToDelete=await req.user.getExpenses({where:{id:id}});
        const expenseAmountToDelete=expenseToDelete[0].expenseAmount;
        const newExpense=req.user.totalExpense - expenseAmountToDelete;
        await expenseToDelete[0].destroy({transaction: t});
        await req.user.update({totalExpense:newExpense},{transaction: t});
        await t.commit(); 
        return res.status(200).json({message:"Expense deleted successfully"});
    }catch(err)
    {
        await t.rollback();
        console.log(err);
        return res.status(500).json(err);
    }
    
}


exports.downloadExpense=async (req,res,next)=>{
    try{
        const expenses=await req.user.getExpenses();
        //console.log(exp);
        const userId=req.user.id;
        const stringifiedExpenses=JSON.stringify(expenses);
        const filename=`Expenses${userId}/${new Date()}.txt`;

        const awsreponse= await uploadToS3(stringifiedExpenses,filename);
        await req.user.createExpensedownload({url:awsreponse.Location});
        return res.status(200).json(expenses);


    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}


async function uploadToS3(data,filename)
{
    const BUCKET_NAME='expensetrackerarfinzz';
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
    })

    
    var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }


    return new Promise((res,rej)=>{

        s3bucket.upload(params,(err,resp)=>{
            if(err)
            {
                rej(err);
            }
            else
            {
                res(resp);
            }
        });
    })
}


exports.downloadHistory=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','downloadhistory.html'));
}


exports.getDownloadHistory=async (req,res,next)=>{
    try{
        const exp=await req.user.getExpensedownloads();
        //console.log(exp);
        const ispremium=req.user.ispremium==true;
        return res.status(200).json({history:exp,ispremium:ispremium});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}


exports.downloadAgain=async (req,res,next)=>{
    try{
        const id=req.params.id;
        const exp=await req.user.getExpensedownloads({where:{id:id}});
        if(exp.length<1)
        {
            throw 'Something went wrong'
        }
        //console.log(exp);

        const response=await axios.get(exp[0].url,{responseType: "text",});
        const objresponse=JSON.parse(response.data);
        return res.status(200).json(objresponse);
        
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}
