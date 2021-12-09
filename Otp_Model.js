const mongo=require("mongoose");
var otp=mongo.Schema({
    _id:mongo.Types.ObjectId,
   username:String,
    code:String,
    expireIn:Number,
},{ timestamps: true },)
module.exports=mongo.model("otpcode",otp)