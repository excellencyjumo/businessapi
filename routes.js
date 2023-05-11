const express=require("express");
const businessController=require('./controllers/business');
const userController=require('./controllers/user')
const auth=require('./middlewares/auth');
const router=express.Router();

// Business-Routes
router.post('/business/create', businessController.createBusiness);
router.post('/business/login',businessController.loginBusiness);
router.post('/business/product/create',businessController.createProduct);
router.patch('/business/:id/update',businessController.updateProduct);
router.delete('/business/:id/delete',businessController.deleteProduct);
router.get('/business/order',businessController.productOrders);

// User-Routes
router.post('/user/register',userController.registerUser);
router.post('/user/login',userController.loginUser);
router.get('/user/product/all', userController.getAllProducts);
// router.get('/user/product',userController.fetchAProduct);
// router.get('/user/allProducts',userController.fetchAllProduct);
// router.post('/user/makeOrder',userController.makeOrder);
// router.get('/user/order',userController.viewOrder);

module.exports=router;