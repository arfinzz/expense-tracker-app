const User=require('../models/user');
const path=require('path');


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

    if(isNotValid(expenseAmount) || isNotValid(description) || isNotValid(category))
    {
        return res.status(400).json({message:"Invaid details"});
    }
    
    try{
       await req.user.createExpense({expenseAmount:expenseAmount,description:description,category:category});
       const oldExpense=req.user.totalExpense;
       const newExpense=oldExpense + + expenseAmount;
       await req.user.update({totalExpense:newExpense});
       return res.status(200).json({message:"Expense created successfully"});
        
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}


exports.getExpense=async (req,res,next)=>{
    try{
        const exp=await req.user.getExpenses();
        //console.log(exp);
        const ispremium=req.user.ispremium==true;
        return res.status(200).json({expense:exp,ispremium:ispremium});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}


exports.deleteExpense=async (req,res,next)=>{
    try{
        const id=req.params.id;
        const expenseToDelete=await req.user.getExpenses({where:{id:id}});
        const expenseAmountToDelete=expenseToDelete[0].expenseAmount;
        const newExpense=req.user.totalExpense - expenseAmountToDelete;
        await expenseToDelete[0].destroy();
        await req.user.update({totalExpense:newExpense}); 
        return res.status(200).json({message:"Expense deleted successfully"});
    }catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}


