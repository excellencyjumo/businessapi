const mongoose=require("mongoose");
require("dotenv").config({path:"../.env"})

const db=async function(){
    try{
        await mongoose.connect(process.env.dbURL)
            // .then(()=>{console.log("Connection successful")})
    }
    catch(err){
        console.log("Couldnt connect to database")
    }
}
module.exports=db;