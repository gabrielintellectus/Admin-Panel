const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "George" },
    lastName: { type: String, default: "Orwell" },
    email: { type: String, default: "EraShopUser123@gmail.com" },
    dob: { type: String, default: "24 february 1996" },
    gender: { type: String, default: "Male" },
    location: { type: String, default: "India" },
    mobileNumber: { type: String, default: null },
    image: { type: String, default: null },

    password: { type: String, default: null },
    uniqueId: { type: String, default: null },
    loginType: { type: Number, enum: [1, 2, 3, 4] }, //1.google 2.Apple 3.email-password 4.isLogin

    identity: { type: String },
    fcmToken: String,
    date: String,

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },

    notification: {
      paymentReminder: { type: Boolean, default: true },
      productDelivery: { type: Boolean, default: true },
      expiredVoucher: { type: Boolean, default: true },
    },

    isSeller: { type: Boolean, default: false },
    isBlock: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ isBlock: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
