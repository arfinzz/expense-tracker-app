const express=require('express');

const adminController=require('../controllers/admin');
const resetPasswordController=require('../controllers/resetpassword')
const router=express.Router();

router.get('/',adminController.getLogin);
router.post('/login',adminController.postLogin);
router.get('/signup',adminController.getSignup);
router.post('/signup',adminController.postSignup);

router.get('/forgotpassword',resetPasswordController.getForgotPasswordPage);
router.post('/forgotpassword',resetPasswordController.postForgotPassword);
router.get('/resetpassword/:uid',resetPasswordController.getResetPassword);
router.post('/resetpassword/:uid',resetPasswordController.postResetPassword);

//router.get('/signup',adminController.home);

module.exports=router;