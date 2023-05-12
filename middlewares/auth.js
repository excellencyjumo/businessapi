const jwt = require('jsonwebtoken');
const sendResponse = require("../utils");
require("dotenv").config({ path: "../.env" })

module.exports.userAuth = function (req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return sendResponse(res, 401, 'No Authorization Header provided');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return sendResponse(res, 401, 'No Authorization Token provided');
        }
        jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
            if (err) {
                return sendResponse(res, 401, 'Invalid Authorization Token');
            }
            const userRole = decoded.user.role;
            if (userRole !== 'customer') {
                return sendResponse(res, 403, 'Not authorized to access this resource');
            }
            else {
                req.user = decoded.user;
            }
        })
    }
    catch (error) {
        return sendResponse(res, 500, 'Server error');
    }
    next();
}
module.exports.businessAuth = function (req, res) {
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
        else{
            req.user=decoded.business;
        }
    }
    catch(err){
        return sendResponse(res, 500, 'Server error');
    }    
    next()
}