const mongoose = require("mongoose");

const sellerRequestSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "EraShopSeller" },
    lastName: { type: String, default: "EraShopSeller123" },
    businessTag: { type: String, default: "@EraShop" },
    businessName: { type: String, default: "EraShop#123" },
    mobileNumber: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: null },
    gender: { type: String, default: null },
    image: { type: String, default: null },
    date: { type: String, default: null },
    uniqueId: { type: String, default: null },
    fcmToken: { type: String, default: null },
    address: {
      address: { type: String, default: null },
      landMark: { type: String, default: null },
      city: { type: String, default: null },
      pinCode: { type: Number, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
    },

    bankDetails: {
      bankBusinessName: { type: String, default: null },
      bankName: { type: String, default: null },
      accountNumber: { type: Number, default: null },
      IFSCCode: { type: String, default: null },
      branchName: { type: String, default: null },
    },

    isAccepted: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

sellerRequestSchema.index({ userId: 1 });
sellerRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("SellerRequest", sellerRequestSchema);
