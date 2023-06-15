const express=require('express');

const userController=require('../controllers/user');
const router=express.Router();

router.get('/login',userController.getLogin);
router.post('/login',userController.postLogin);
router.get('/signup',userController.getSignup);
router.post('/signup',userController.postSignup);

//router.get('/signup',userController.home);

module.exports=router;