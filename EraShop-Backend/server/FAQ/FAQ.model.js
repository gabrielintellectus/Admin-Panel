const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    isView: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FAQSchema.index({ createdAt: 1 });

module.exports = mongoose.model("FAQ", FAQSchema);
