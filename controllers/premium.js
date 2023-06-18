const User=require('../models/user');
const path=require('path');
const sequelize=require('../utils/database');




exports.getLeaderboadPage=(req,res,next)=>{
    //console.log("inside get")
   res.sendFile(path.join(__dirname,'../','views','leaderboard.html'));
}

exports.getLeaderboard=async (req,res,next)=>{
    try{
        const [results, metadata] = await sequelize.query("SELECT * FROM expenses INNER JOIN users ON expenses.userId = users.id ORDER BY expenseAmount DESC");
        console.log(results);
        return res.status(200).json({"result":results});

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
    
}



