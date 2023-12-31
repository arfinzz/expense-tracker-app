const express=require('express');

const premiumController=require('../controllers/premium');
const auth=require('../middleware/auth');

const router=express.Router();

router.get('/premium/leaderboard',premiumController.getLeaderboadPage);
router.get('/premium/getleaderboard',auth.premium,premiumController.getLeaderboard);

router.get('/premium/report',premiumController.getReportPage);

router.get('/premium/getreport',auth.premium,premiumController.getReport);



module.exports=router;