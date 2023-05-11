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
// delete your businessProfile

// create a businessProduct
const createProduct = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const userRole = decoded.business.role;
    if (userRole !== 'business') {
      return sendResponse(res, 403, 'Not authorized to access this resource');
    }

    const { productname } = req.body;
    if (!productname) {
      return sendResponse(res, 400, 'Product name is required');
    }

    const newProduct = new productModel({ productName: productname });
    await newProduct.save();
    return sendResponse(res, 201, 'Product created successfully', newProduct);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, 'Server error');
  }
};

// update a product on businessProfile
const updateProduct = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const userEmail = decoded.business.email;
    const productToUpdateId = req.params.id;

    const business = await businessModel.findOne({ email: userEmail });
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
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, 'Server error');
  }
};

// delete a product on businessProfile
const deleteProduct = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const businessEmail = decoded.business.email;

    const product = await productModel.findById(req.params.id);
    if (!product) {
      return sendResponse(res, 404, 'Product not found');
    }

    const business = await businessModel.findOne({ email: businessEmail });
    if (!business) {
      return sendResponse(res, 404, 'Business not found');
    }

    if (!business.productId.includes(req.params.id)) {
      return sendResponse(res, 403, 'Not authorized to delete this product');
    }

    await productModel.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    console.log(error.toString());
    return sendResponse(res, 500, 'Server error');
  }
};

// check orders made on businessProducts
const productOrders = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendResponse(res, 401, 'No Authorization Token provided');
    }

    jwt.verify(token, process.env.JWTSECRET, async (err, decoded) => {
      if (err) {
        return sendResponse(res, 401, 'Invalid Authorization Token');
      }

      const businessEmail = decoded.business.email;

      const business = await businessModel.findOne({ email: businessEmail });
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
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, 'Server error');
  }
};

// process or cancel orders on businessProducts
module.exports = {
  createBusiness,
  loginBusiness,
  createProduct,
  updateProduct,
  deleteProduct,
  productOrders
};