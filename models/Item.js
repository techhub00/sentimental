const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const ItemSchema=new Schema({
  
  Ukey:{
    type:String,
    required:true
  },
  Item_Title:{
    type:String,
    required:true
  },
  Item_Sub_Title:{
    type:String,
    required:true
  },
  Item_Color:{
    type:String,
    required:true
  },
  Item_Sale:{
    type:String,
    required:true
  },

  Price:{
    type:String,
    required:true
  },
  Qty:{
    type:String,
    required:true
  },
  Picture_1:{
    type:String,
    required:true
  },
  Picture_2:{
    type:String,
    required:true
  },
  Picture_3:{
    type:String,
    required:true
  },
  Picture_4:{
    type:String,
    required:true
  }
  
});
mongoose.model('item',ItemSchema);