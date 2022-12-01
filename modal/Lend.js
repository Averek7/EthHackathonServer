const mongoose = require("mongoose");
const { Schema } = mongoose;

const lenderSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  lender_address: {
    type: String,
  },
  borrower_address: {
    type: String,
  },
  contract_address: {
    type: String,
    unique: true,
  },
  token_id: {
    type: String,
  },
  roi: {
    type: Number,
  },
  repay: {
    type: Number,
  },
  transaction:{
    type:String,
    enum:["progress","completed"]
  }
});

const lentnft = mongoose.model("Lend", lenderSchema);
module.exports = lentnft;
