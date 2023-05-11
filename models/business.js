const {Schema,model}=require("mongoose");

const businessSchema = new Schema({
    _id:String,
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: {
        type:String,
        unique: true,
        validate:{
            validator:function(v){
                return v.endsWith('.com');
            },
            message:props=>`${props.value} is not a valid email.`
        },
        required:true
        },
    message: String,
    role:{
        type:String,
        default:"business",
        enum: ["business"]
    },
    productId: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    qrCode: String
})

const businessModel= model("Business",businessSchema);
module.exports=businessModel;