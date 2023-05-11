const {Schema,model}=require("mongoose");

const productSchema = new Schema({productName: String},{timestamps:true})

const productModel= model("Product",productSchema);
module.exports=productModel;