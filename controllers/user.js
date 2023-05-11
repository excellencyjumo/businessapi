const userModel=require("../models/user");
const productModel=require("../models/product")
const sendResponse = require("../utils");
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");
require("dotenv").config({path:"../.env"});
//register User
const registerUser =async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      let user = await userModel.findOne({ username });
  
      if (user) {
        return sendResponse(res,400,'User already exists')
      }
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);

      user = new userModel({
        email,
        username,
        password:hashedpassword
      });
  
      await user.save();
  
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: process.env.EXPIRY},
        (err, token) => {
          if (err) throw err;
          return sendResponse(res,200,"Token Created",token)
        }
      );
    } catch (err) {
      console.error(err.message);
      return sendResponse(res,500,'Server error')
    }
  }
  
// Login user
const loginUser =async (req, res) => {
    const { username, password } = req.body;

    try {
      let user = await userModel.findOne({ username });

      if (!user) {
        return sendResponse(res,400,'Invalid Credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return sendResponse(res,400,'Invalid Credentials');
      }

      const payload = {
        user: {
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: process.env.EXPIRY },
        (err, token) => {
          if (err) throw err;
          return sendResponse(res,200,"Token Created",token)
        }
      );
    } catch (err) {
        console.error(err.message);
        return sendResponse(res,500,'Server Error');
    }
  }

// get all productsProfiles
// get all productsProfiles
const getAllProducts=async(req,res)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log(authHeader);
            return sendResponse(res,401,'1 No Authorization Token provided');
        }
        console.log(authHeader);
        const token = authHeader.split(' ')[1];
        if (!token) {
            return sendResponse(res,401,'2 No Authorization Token provided');
        }

        jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
            if (err) {
                return sendResponse(res,401,'3 Invalid Authorization Token');
            }
            console.log(decoded);
            const userRole = decoded.user.role;
            console.log(userRole)
            if (userRole !== 'customer') {
                return sendResponse(res,403,'Not authorized to access this resource');
            }

           try { 
                const data = productModel.find().exec();
                if (data.length == 0) {
                    console.log(data);
                    return sendResponse(res,400,'No Product Available right now');
                } else {
                    return sendResponse(res,200,`Fetched succesfully`,data);
                }
            }
            catch(err){
                return sendResponse(res,400,'Could not fetch all Products');
            };
        });
    } catch(error){
        console.log(error.toString());
        return sendResponse(res,500,'Server error');
    }
}


//makeAnOrder
//viewAllOrders
//fetchAProduct
//fetchAllProducts

module.exports = {registerUser,loginUser,getAllProducts};
