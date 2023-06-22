const express=require('express');

const expenseController=require('../controllers/expense');
const auth=require('../middleware/auth');
const router=express.Router();

router.get('/expense',expenseController.displayUserHome);
router.get('/expense/getExpense',auth.user,expenseController.getExpense);

router.post('/expense/postExpense',auth.user,expenseController.addExpense);
router.get('/expense/deleteExpense/:id',auth.user,expenseController.deleteExpense);

router.get('/expense/downloadExpense',auth.user,expenseController.downloadExpense);

router.get('/expense/downloadhistory',expenseController.downloadHistory);
router.get('/expense/getDownloadHistory',auth.user,expenseController.getDownloadHistory);
router.get('/expense/downloadagain/:id',auth.user,expenseController.downloadAgain);





module.exports=router;