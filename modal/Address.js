const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema({
  wallet_address: { type: String },
  contract_address: { type: String },
  token_id: { type: String },
});

const address = mongoose.model("address", AddressSchema);
module.exports = address;
