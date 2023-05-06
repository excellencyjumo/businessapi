const express=require("express");
const {createBusiness,getAllBusiness}=require("./controllers/business")
const router=express.Router();

router.post('/create', createBusiness);
router.get('/all', getAllBusiness);

module.exports=router;