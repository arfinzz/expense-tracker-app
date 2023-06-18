const express=require('express');
const Sequelize=require('sequelize');

const bodyParser=require('body-parser');
const path=require('path');

const sequelize=require('./utils/database');
const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');


const adminRoutes=require('./routes/admin');
const expenseRoutes=require('./routes/expense');
const paymentRoutes=require('./routes/payment');
const premiumRoutes=require('./routes/premium');

const app=express();

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json({extended:true}));

app.use(adminRoutes);
app.use(expenseRoutes);
app.use(paymentRoutes);
app.use(premiumRoutes);




User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

//{force:true}
sequelize.sync()
.then(()=>{
    console.log('Listening at port 3300');
    app.listen(3300);
})
.catch(err=>{
    console.log(err);
})


