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

const borrowedNft = mongoose.model("Borrow", BorrowSchema);
module.exports = borrowedNft;
