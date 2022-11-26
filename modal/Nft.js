const mongoose = require("mongoose");
const { Schema } = mongoose;

const NftSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  wallet_address: {
    type: String,
    unique: true,
  },
  nft_address: {
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

const nftwallet = mongoose.model("nftwallet", NftSchema);
module.exports = nftwallet;
