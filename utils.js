module.exports=function sendResponse(res,status,message,data){
    res.status(status).json({
        status,
        message,
        data,
    })
};