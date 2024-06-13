const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    paymentGateway: { type: Number },
    paymentGateWayId: { type: String },
    gatewayReturn: { type: Object, default: {}}
  }
);

paymentSchema.index({ userId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
