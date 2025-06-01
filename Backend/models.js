const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  Question: { type: String, required: true },
  Answer: { type: String, required: true },
  known:{type:Boolean,default:false}
});
module.exports = mongoose.model("card", cardSchema);
