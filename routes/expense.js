const express=require('express');

const expenseController=require('../controllers/expense');
const auth=require('../middleware/auth');
const router=express.Router();

router.get('/expense',expenseController.displayUserHome);
router.get('/expense/getExpense',auth.user,expenseController.getExpense);

router.post('/expense/postExpense',auth.user,expenseController.addExpense);
router.get('/expense/deleteExpense/:id',auth.user,expenseController.deleteExpense);


module.exports=router;