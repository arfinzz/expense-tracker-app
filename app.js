const express=require('express');
const Sequelize=require('sequelize');
const bodyParser=require('body-parser');
const path=require('path');

const sequelize=require('./utils/database');
const User=require('./models/user')
const Expense=require('./models/expense')

const adminRoutes=require('./routes/admin');
const expenseRoutes=require('./routes/expense');

const app=express();

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json({extended:true}));

app.use(adminRoutes);
app.use(expenseRoutes);



User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

sequelize.sync({force:true})
.then(()=>{
    console.log('Listening at port 3300');
    app.listen(3300);
})
.catch(err=>{
    console.log(err);
})


