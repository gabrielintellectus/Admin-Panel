const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "EraShopSeller" },
    lastName: { type: String, default: "EraShopSeller123" },
    businessTag: { type: String, default: "@EraShop" },
    businessName: { type: String, default: "EraShop#123" },

    email: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    gender: { type: String, default: "male" },
    image: { type: String, default: null },

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

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },

    identity: { type: String },
    uniqueId: { type: String, default: null },

    fcmToken: { type: String, default: null },
    date: String,

    password: { type: String, default: null },
    loginType: { type: Number, enum: [1, 2, 3, 4] }, //1.google 2.Apple 3.email-password 4.isLogin
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    channel: { type: String, default: null },
    isLive: { type: Boolean, default: false },
    liveSellingHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: "LiveSellingHistory", default: null },

    isBlock: { type: Boolean, default: false },
    isSeller: { type: Boolean, default: true },

    isFake: { type: Boolean, default: false },
    video: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

sellerSchema.index({ userId: 1 });
sellerSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Seller", sellerSchema);
