const {Schema,model}=require("mongoose");

const userSchema = new Schema({
    username:{ 
      type:String,
      unique:true
    },
    email: {
        type:String,
        validate:{
            validator:function(v){
                return v.endsWith('.com');
            },
            message:err=>`${err.value} is not a valid email.`
        },
        default:"empty@mail.com"
        },
    password: String,
    role: {
        type: String,
        default: "customer",
        enum: ["customer"],
      },
    orders: [
        {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
      ]
    },
    {timestamps:true}
)

const userModel= model("Customer",userSchema);
module.exports=userModel;