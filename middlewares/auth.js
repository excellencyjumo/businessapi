const jwt = require('jsonwebtoken');
const sendResponse = require("../utils");
require("dotenv").config({ path: "../.env" })

module.exports.userAuth = function (req, res,next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return sendResponse(res, 401, 'No Authorization Header provided');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return sendResponse(res, 401, 'No Authorization Token provided');
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(decoded);
                return sendResponse(res, 401, 'Invalid Authorization Token',token);
            }
            const userRole = decoded.user.role;
            if (userRole !== 'customer') {
                
                return sendResponse(res, 403, 'Not authorized to access this resource');
            }
            else {
                console.log(decoded);
                req.user = decoded.user;
                next()
            }
        })
    }
    catch (error) {
        console.log(error.toString())
        return sendResponse(res, 500, 'Server error');
    }

}
module.exports.businessAuth = function (req, res,next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return sendResponse(res, 401, 'No Authorization Token provided');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return sendResponse(res, 401, 'No Authorization Token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        const userRole = decoded.role;
        if (userRole !== 'business') {
            return sendResponse(res, 403, 'Not authorized to access this resource');
        }
        else {
            req.user = decoded;
            next()
        }
    }
    catch (err) {
        console.log(err.toString())
        return sendResponse(res, 500, 'Server error');
    }

}