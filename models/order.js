const {Schema,model}=require("mongoose");

const orderSchema = new Schema({
    status: 
      {
        type: String,
        enum:['pending', 'processing', 'completed', 'cancelled'],
      },
    product: 
        [{
          type: Schema.Types.ObjectId,
          ref: "Product",
        }],
  },
    {timestamps:true}
)

const orderModel= model("Order",orderSchema);
module.exports=orderModel;