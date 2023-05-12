const userModel = require("../models/user");
const productModel = require("../models/product")
const sendResponse = require("../utils");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
//register User
const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let user = await userModel.findOne({ username });

    if (user) {
      return sendResponse(res, 400, 'User already exists')
    }
    const salt = await bcrypt.genSalt(10);
    hashedpassword = await bcrypt.hash(password, salt);

    user = new userModel({
      email,
      username,
      password: hashedpassword
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
      { expiresIn: process.env.EXPIRY },
      (err, token) => {
        if (err) throw err;
        return sendResponse(res, 200, "Token Created", token)
      }
    );
  } catch (err) {
    console.error(err.message);
    return sendResponse(res, 500, 'Server error')
  }
}

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await userModel.findOne({ username });

    if (!user) {
      return sendResponse(res, 400, 'Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, 400, 'Invalid Credentials');
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: process.env.EXPIRY },
      (err, token) => {
        if (err) throw err;
        return sendResponse(res, 200, "Token Created", token)
      }
    );
  } catch (err) {
    console.error(err.message);
    return sendResponse(res, 500, 'Server Error');
  }
}

// fetchAProduct
const getAproduct = async (req, res) => {
  try {
    const data = productModel.find({ productName: req.body.productname }).exec();
    if (data.length == 0) {
      console.log(data);
      return sendResponse(res, 400, 'No Product Available right now');
    } else {
      return sendResponse(res, 200, `Fetched succesfully`, data);
    }
  }
  catch (err) {
    return sendResponse(res, 400, 'Could not fetch all Products');
  };
}

// get all productsProfiles
const getAllProducts = async (req, res) => {
  try {
    const data = await productModel.find();
    if (data.length == 0) {
      return sendResponse(res, 400, 'No Product Available right now');
    } else {
      return sendResponse(res, 200, `Fetched succesfully`, data);
    }
  }
  catch (err) {
    return sendResponse(res, 400, 'Could not fetch all Products');
  };
};

//makeAnOrder
const makeAnOrder = async (req, res) => {
      const { productId } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      const order = await Order.create({
        //the productId is an array of different productIDS
        product: productId,
        status: "pending",
      });
      const customer = await userModel.findById(req.user.id);
      customer.orders.push(order._id);
      await customer.save();
      return sendResponse(res, 201, "Order created", order)
}

//viewAllOrders
const viewOrders= async(req,res)=>{
  try {
    // Get the user ID from the decoded JWT
    const userId = req.user.id;
    
    // Find the user in the database and populate their orders
    const user = await userModel.findById(userId).populate('orders');

    // Send the user's orders as a response
    return sendResponse(res,200,'Orders fetched succesfully',user.orders)
  } catch (err) {
    // Send an error response if something goes wrong
   return sendResponse(res,500,'An error occurred while getting the user\'s orders.')
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAproduct,
  getAllProducts,
  makeAnOrder,
  viewOrders
};
