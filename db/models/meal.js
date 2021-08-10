const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  Name:{
    type:String
  },
  UserId: {
    type: String,
  },
  Meal:{
      type:String,
      required:true,
  },
  Type:{
    type:String,
    required:true,
  },
  Description:{
      type:String,
      required:true
  },
  Calories:{
    type:Number,
    required:true
  }
});

module.exports = mongoose.model("Meal", UserSchema);