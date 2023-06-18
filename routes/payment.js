const express=require('express');

const paymentController=require('../controllers/payment');
const auth=require('../middleware/auth');

const router=express.Router();

router.get('/payment/buypremium',auth.user,paymentController.buyPremium);
router.post('/payment/buypremiumsuccess',auth.user,paymentController.premiumSuccess);
router.post('/payment/buypremiumfailed',auth.user,paymentController.premiumFailed);


module.exports=router;