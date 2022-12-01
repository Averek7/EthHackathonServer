const mongoose = require("mongoose");
const { Schema } = mongoose;

const BorrowSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  borrower_address: {
    type: String,
  },
  contract_address: {
    type: String,
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
  amount:{
    type:Number,
  },
});

const borrowedNft = mongoose.model("Borrow", BorrowSchema);
module.exports = borrowedNft;
