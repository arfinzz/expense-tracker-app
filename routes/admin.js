const express=require('express');

const adminController=require('../controllers/admin');
const router=express.Router();

router.get('/',adminController.getLogin);
router.post('/login',adminController.postLogin);
router.get('/signup',adminController.getSignup);
router.post('/signup',adminController.postSignup);

//router.get('/signup',adminController.home);

module.exports=router;