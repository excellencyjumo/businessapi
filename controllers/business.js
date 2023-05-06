const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const sendResponse = require("../utils");
const businessModel=require("../models/business");

//create a business
const createBusiness = async (req,res) => {
    try {
      // Generate unique character id for the business
      const id = uuidv4().substr(0, 7);
      // Generate QR code using the unique id
      const qrCode= await QRCode.toString(id)
      // Save the QR code image to the 'qrcodes' folder
      await QRCode.toFile(`./qrcode/${id}.png`,id);

      // Save the record to the database
      const business = new businessModel({
        _id:id,
        ...req.body,
        qrCode:qrCode
      });

      await business.save();
  
      // Return a response object containing the link to the business's page
      sendResponse(res,400,`http://bus.me/${id}`,business)
    } catch (error) {
      console.log(error.toString());
      sendResponse(res,400,'Could not create business');
    }
  };

// get your businessById

// get all businessProfiles
const getAllBusiness=async(req,res)=>{
    try{
        const data = await businessModel.find();
        sendResponse(res,400,`Fetched succesfully`,data)
    }catch(error){
        console.log(error.toString());
        sendResponse(res,400,'Could not fetch all business');
    }
}
// update your businessProfile

module.exports={createBusiness,getAllBusiness};