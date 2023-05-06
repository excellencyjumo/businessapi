const {Schema,model}=require("mongoose");

const businessSchema = new Schema({
    _id:String,
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    email: {
        type:String,
        validate:{
            validator:function(v){
                return v.endsWith('.com');
            },
            message:props=>`${props.value} is not a valid email.`
        },
        default:"emptymail.com"
        },
    message: String,
    qrCode: String
})

const businessModel= model("businessProfile",businessSchema);
module.exports=businessModel;