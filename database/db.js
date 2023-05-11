const mongoose=require("mongoose");
require("dotenv").config({path:"../.env"})

const db=async function(){
    try{
        await mongoose.connect(process.env.dbURI);
    }
    catch(err){
        console.log("Couldnt connect to database at ",err.toString())
    }
}
// Listen for the 'error' event        
mongoose.connection.on('error', (err) => {
    console.log("MONGODB Server Down");
});

module.exports=db;