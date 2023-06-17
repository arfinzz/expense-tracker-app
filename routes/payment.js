const express=require('express');

const paymentController=require('../controllers/payment');
const auth=require('../middleware/auth');

const router=express.Router();

router.get('/payment',auth.authenticate,paymentController.payment);
router.post('/payment',auth.authenticate,paymentController.updateUser);
router.post('/payment/failed',auth.authenticate,paymentController.failedPayment);


module.exports=router;