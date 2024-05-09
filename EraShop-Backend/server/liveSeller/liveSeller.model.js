const mongoose = require("mongoose");

const liveSellerSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String },
    businessName: { type: String },
    businessTag: { type: String },

    channel: { type: String },
    agoraUID: { type: Number, default: 0 },

    view: { type: Number, default: 0 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    liveSellingHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: "LiveSellingHistory" },
    selectedProducts: { type: Array, deafult: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

liveSellerSchema.index({ sellerId: 1 });
liveSellerSchema.index({ liveSellingHistoryId: 1 });

module.exports = mongoose.model("LiveSeller", liveSellerSchema);
