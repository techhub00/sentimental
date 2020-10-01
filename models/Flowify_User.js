const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const Flowify_UserSchema=new Schema({
  First_Name:{
    type:String,
    required:true
  },
  Last_Name:{
    type:String,
    required:true
  },
  Email:{
    type:String,
    required:true
  },
  Password:{
    type:String,
    required:true
  },
  Login_Status:{
    type:String,
    required:true
  },
  Country:{
    type:String,
    required:true
  },
  Picture:{
    type:String,
    required:true
  },
  Stripe_Account:{
    type:String,
    required:true
  },
  Stripe_Account_Verification:{
    type:String,
    required:true
  },
  
  
});
mongoose.model('flowify_user',Flowify_UserSchema);