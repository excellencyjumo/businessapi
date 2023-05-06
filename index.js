const express=require("express");
const env=require("dotenv").config()
const router=require("./routes");
const sendResponse=require("./utils")
const app=express();
const db=require("./database/db");
app.use(express.json())
app.use("/business",router);
app.use((req,res)=>{
    sendResponse(res,400,"PAGE NOT FOUND")
})
const PORT=process.env.PORT||8000;
  

db().
    then(
        app.listen(PORT,()=>{
            console.log(`server running on PORT ${PORT}`)
            console.log("Mongodb server running succesfully.")
})).catch((err=>{
        console.log("MONGODB Server Down")
}))
