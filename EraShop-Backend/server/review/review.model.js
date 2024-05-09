const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    productId: { ref: "Product", type: mongoose.Schema.Types.ObjectId },
    review: { type: String },
    date: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reviewSchema.index({ userId: 1 });
reviewSchema.index({ productId: 1 });

module.exports = mongoose.model("Review", reviewSchema);
