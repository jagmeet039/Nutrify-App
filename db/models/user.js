const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Calories: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model("User", UserSchema);