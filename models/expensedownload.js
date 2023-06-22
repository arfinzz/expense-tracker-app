const Sequelize=require('sequelize');

const sequelize=require('../utils/database');

const Expensedownload=sequelize.define('expensedownload',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url:Sequelize.STRING,
});

module.exports=Expensedownload;