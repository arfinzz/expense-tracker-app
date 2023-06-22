const User=require('../models/user');
const path=require('path');
const sequelize=require('../utils/database');




exports.getLeaderboadPage=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','leaderboard.html'));
}

exports.getLeaderboard=async (req,res,next)=>{
    try{
        const [results, metadata] = await sequelize.query("SELECT totalExpense AS expense, name FROM users ORDER BY expense DESC;");
        //console.log(results);
        return res.status(200).json({"result":results});

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}


exports.getReportPage=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','report.html'));
}



exports.getReport=async (req,res,next)=>{
    
    try{
        const id=req.user.id;
        const [dailyReport, metadata1] = await sequelize.query(`SELECT SUM(expenseAmount) AS expense, DATE_FORMAT(createdAt, "%e-%b-%y") as date FROM expenses WHERE userId=${id} GROUP BY date ORDER BY createdAt;`);
        const [monthlyReport, metadata2] = await sequelize.query(`SELECT SUM(expenseAmount) AS expense, DATE_FORMAT(createdAt, "%b-%y") as date FROM expenses WHERE userId=${id} GROUP BY date ORDER BY createdAt;`);
        //console.log(monthlyReport);
        //console.log(dailyReport);
        return res.status(200).json({"result":{"dailyReport":dailyReport,"monthlyReport":monthlyReport}});

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }

   
    
   
}



