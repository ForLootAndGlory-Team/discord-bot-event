const mongoose = require('mongoose');

const FeeStructSchema = new mongoose.Schema({
  recipient: String,
  amount: String,
  feeData: String,
}, { _id: false });

const PropertyStructSchema = new mongoose.Schema({
  propertyValidator: String,
  propertyData: String,
}, { _id: false });

const SignatureStructSchema = new mongoose.Schema({
  signatureType: Number,
  v: Number,
  r: String,
  s: String,
}, { _id: false });

const ERC721OrderSchema = new mongoose.Schema({
  direction: Number,
  maker: String,
  taker: String,
  expiry: String,
  nonce: String,
  erc20Token: String,
  erc20TokenAmount: String,
  fees: [FeeStructSchema],
  erc721Token: String,
  erc721TokenId: String,
  erc721TokenProperties: [PropertyStructSchema],
  signature: SignatureStructSchema,
  sellOrBuyNft: String,
  chainId: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { _id: false });

const ERC1155OrderSchema = new mongoose.Schema({
  direction: Number,
  maker: String,
  taker: String,
  expiry: String,
  nonce: String,
  erc20Token: String,
  erc20TokenAmount: String,
  fees: [FeeStructSchema],
  erc1155Token: String,
  erc1155TokenId: String,
  erc1155TokenProperties: [PropertyStructSchema],
  signature: SignatureStructSchema,
  erc1155TokenAmount: String,
  sellOrBuyNft: String,
  chainId: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { _id: false });

const ERC721Order = mongoose.model('ERC721Order', ERC721OrderSchema);
const ERC1155Order = mongoose.model('ERC1155Order', ERC1155OrderSchema);

module.exports = { ERC721Order, ERC1155Order };
