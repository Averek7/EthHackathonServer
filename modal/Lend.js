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
    unique: true,
  },
  borrowers_address: {
    type: String,
    unique: true,
  },
  contract_address: {
    type: String,
    unique: true,
  },
  token_id: {
    type: String,
    unique: true,
  },
  roi: {
    type: Number,
  },
  repay: {
    type: Number,
  },
});

const lentnft = mongoose.model("Lend", lenderSchema);
module.exports = lentnft;
