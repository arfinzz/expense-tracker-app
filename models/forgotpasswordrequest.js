const Sequelize=require('sequelize');

const sequelize=require('../utils/database');

const Forgotpasswordrequest=sequelize.define('forgotpasswordrequest',{
    id:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    
});

module.exports=Forgotpasswordrequest;