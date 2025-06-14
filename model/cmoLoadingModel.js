// models/cmoLoadingModel.js
const mongoose = require("mongoose");

const cmoLoadingSchema = new mongoose.Schema({
  dateofLoading: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  empId: {
    type: String,
    required: true,
  },
  empName: {
    type: String,
    required: true,
  },
  empMobile: {
    type: String,
    required: true,
  },
  cameraNo: {
    type: String,
    required: true,
  },
  atmId: {
    type: String,
    required: true,
  },
  mspName: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  routeName: {
    type: String,
    required: true,
  },
  deno500: {
    type: Number,
    required: true,
  },
  deno200: {
    type: Number,
    required: true,
  },
  deno100: {
    type: Number,
    required: true,
  },
  cs1Seal: {
    type: String,
    required: true,
  },
  cs2Seal: {
    type: String,
    required: true,
  },
  cs3Seal: {
    type: String,
    required: true,
  },
  cs4Seal: {
    type: String,
    required: true,
  },
  purgeSeal: {
    type: String,
    required: true,
  },
  bagSeal: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("CMOLoading", cmoLoadingSchema);
