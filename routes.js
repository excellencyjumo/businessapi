const express=require("express");
const businessController=require('./controllers/business');
const userController=require('./controllers/user')
const auth=require('./middlewares/auth');
const router=express.Router();

// Business-Routes
router.post('/business/create',businessController.createBusiness);
router.post('/business/login',businessController.loginBusiness);
router.get('/business/profile',auth.businessAuth,businessController.viewBusinessProfile);
router.post('/business/product/create',auth.businessAuth,businessController.createProduct);
router.patch('/business/:id/update',auth.businessAuth,businessController.updateProduct);
router.delete('/business/:id/delete',auth.businessAuth,businessController.deleteProduct);
router.get('/business/order',auth.businessAuth,businessController.productOrders);

// User-Routes
router.post('/user/register',userController.registerUser);
router.post('/user/login',userController.loginUser);
router.get('/user/product/all',auth.userAuth, userController.getAllProducts);
router.get('/user/product',auth.userAuth,userController.getAproduct);
router.post('/user/makeOrder',auth.userAuth,userController.makeAnOrder);
router.get('/user/order',auth.userAuth,userController.viewOrders);

module.exports=router;