const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rating: { type: Number, default: 0 },
    userId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    productId: { ref: "Product", type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

ratingSchema.index({ userId: 1 });
ratingSchema.index({ productId: 1 });

module.exports = mongoose.model("Rating", ratingSchema);
