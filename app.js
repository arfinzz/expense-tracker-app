const express=require('express');
const Sequelize=require('sequelize');
const bodyParser=require('body-parser');
const path=require('path');

const sequelize=require('./utils/database');
const User=require('./models/user')
const userRoutes=require('./routes/user');
const app=express();
app.use(bodyParser.json({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(userRoutes);


sequelize.sync({force:true})
.then(()=>{
    console.log('Listening at port 3300');
    app.listen(3300);
})
.catch(err=>{
    console.log(err);
})


