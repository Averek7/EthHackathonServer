const mongoose = require("mongoose");
const { Schema } = mongoose;

const NftSchema = new Schema({
  title: {
    type: String,
    required:true,
  },
  description: {
    type: String,
    required:true,
  },
  wallet_address: {
    type: String,
    required:true,
  },
  contract_address: {
    type: String,
    unique: true,
    required:true,
  },
  token_id: {
    type: String,
    required:true
  },
  roi: {
    type: Number,
  },
  repay: {
    type: Number,
  },
  status:{
    type:String,
    enum:["open","borrowed","lent","claimed"],
    required:true,
  },
  image:{
    type:String
  },
});

const nftwallet = mongoose.model("nftwallet", NftSchema);
module.exports = nftwallet;
