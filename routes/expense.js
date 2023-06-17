const express=require('express');

const expenseController=require('../controllers/expense');
const auth=require('../middleware/auth');
const router=express.Router();

router.get('/expense',expenseController.displayExpense);
router.get('/expense/getExpense',auth.authenticate,expenseController.getExpense);

router.post('/expense/postExpense',auth.authenticate,expenseController.addExpense);
router.get('/expense/deleteExpense/:id',auth.authenticate,expenseController.deleteExpense);


module.exports=router;