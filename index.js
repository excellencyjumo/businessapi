const express=require("express");
require("dotenv").config()
const router=require("./routes");
const sendResponse=require("./utils")
const db=require("./database/db");
const app=express();
app.use(express.json())
app.use(router);
app.use((req,res)=>{
    sendResponse(res,400,"PAGE NOT FOUND")
})
const PORT=process.env.PORT||8000;
  

db().
    then(app.listen(PORT,()=>{
        console.log(`server running on PORT ${PORT}`);
        console.log("Mongodb server running succesfully.")
})).catch((err=>{
        console.log("MONGODB Server Down")
}))
