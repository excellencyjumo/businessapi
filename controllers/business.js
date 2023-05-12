const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const sendResponse = require("../utils");
const businessModel = require("../models/business");
const productModel = require("../models/product")
require("dotenv").config({ path: "../.env" })

//create a business
const createBusiness = async (req, res) => {
  try {
    // Generate unique character id for the business
    const id = uuidv4().substr(0, 7);
    // Generate QR code using the unique id
    const qrCode = await QRCode.toString(id)
    // Save the QR code image to the 'qrcodes' folder
    await QRCode.toFile(`./qrcode/${id}.png`, id);
    //create a business Object
    const business = new businessModel({
      _id: id,
      ...req.body,
      qrCode: qrCode
    });

    // Save the record to the database
    await business.save();

    const payload = {
      email: req.body.email,
      role: 'business'
    };
    const token = jwt.sign(
      payload,
      process.env.JWTSECRET,
      { expiresIn: process.env.EXPIRY },
      (err, token) => {
        if (err) { throw error }
        return token
      });
    // Return a response object containing the link to the business's page
    // Return a token inclusive to the business login Page
    sendResponse(res, 400, `http://bus.me/${id}`, token);
  } catch (error) {
    console.log(error.toString());
    sendResponse(res, 400, 'Could not create business');
  }
};
//login to business
const loginBusiness = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the business with the given email
    const business = await businessModel.findOne({ email });

    // If the business does not exist, return an error response
    if (!business) {
      return sendResponse(res, 401, 'Invalid email');
    }

    // Generate a JWT containing the business email and role
    const payload = {
      email: business.email,
      role: business.role,
    };
    const token = jwt.sign(payload, process.env.JWTSECRET, { expiresIn: process.env.EXPIRY });

    // Return a success response with the JWT as a token property in the response body
    sendResponse(res, 200, 'Login successful', token);
  } catch (error) {
    console.log(error.toString());
    sendResponse(res, 400, 'Could not login');
  }
};

// update your businessProfile
// get your businessProfile
const viewBusinessProfile = async (req, res) => {
  try {
    // Find the business profile associated with the logged in user
    const businessProfile = await BusinessProfile.findOne({ email: req.user.email });

    if (!businessProfile) {
      return sendResponse(res,404,"Business profile not found") 
    }
    // Populate the "product" array of the business profile with the associated products
    await businessProfile.populate('product');
    // Return the populated business profile object as the response
    return sendResponse(res,200,"Business Data Available",businessProfile)
  } catch (error) {
    return sendResponse(res,500,"Server error",error.toString())
  }
};
// delete your businessProfile

// create a businessProduct
const createProduct = async (req, res) => {
  
    const { productname } = req.body;
    if (!productname) {
      return sendResponse(res, 400, 'Product name is required');
    }

    const newProduct = new productModel({ productName: productname });
    await newProduct.save();
    const business = await businessModel.findOne({email: req.user.email});
    // Add the reference to the new product's ID to the productIds array
    business.productId.push(newProduct._id);
    // Save the updated business object
    await business.save();
    return sendResponse(res, 201, 'Product created successfully', newProduct);
  }

// update a product on businessProfile
const updateProduct = async (req, res) => {
    const productToUpdateId = req.params.id;

    const business = await businessModel.findOne({ email: req.user.email });
    if (!business) {
      return sendResponse(res, 404, 'Business not found');
    }

    const productIndex = business.productId.indexOf(productToUpdateId);
    if (productIndex === -1) {
      return sendResponse(res, 404, 'Product not found');
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productToUpdateId,
      { productName: req.body.productname },
      { new: true });
    return sendResponse(res, 200, 'Product updated successfully', updatedProduct);
};

// delete a product on businessProfile
const deleteProduct = async (req, res) => {
    const business = await businessModel.findOne({email: req.user.email});
    if (!business) {
      return sendResponse(res, 404, 'Business not found');
    }

    if (!business.productId.includes(req.params.id)) {
      return sendResponse(res, 403, 'Not authorized to delete this product');
    }

    await productModel.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, 'Product deleted successfully');
  }

// check orders made on businessProducts
const productOrders = async (req, res) => {
   const business = await businessModel.findOne({ email: req.user.email });
      if (!business) {
        return sendResponse(res, 404, 'Business not found');
      }
      const productIds = business.productId;

      const pendingOrders = await orderModel.find({
        status: 'pending',
        product: { $in: productIds }
      }).populate('product');

      const processingOrders = await orderModel.find({
        status: 'processing',
        product: { $in: productIds }
      }).populate('product');

      const completedOrders = await orderModel.find({
        status: 'completed',
        product: { $in: productIds }
      }).populate('product');

      const cancelledOrders = await orderModel.find({
        status: 'cancelled',
        product: { $in: productIds }
      }).populate('product');

      const orders = {
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders
      };

      return sendResponse(res, 200, 'Orders fetched successfully', orders);
    };

// process or cancel orders on businessProducts


module.exports = {
  createBusiness,
  loginBusiness,
  viewBusinessProfile,
  createProduct,
  updateProduct,
  deleteProduct,
  productOrders
};