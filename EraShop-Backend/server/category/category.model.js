const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    image: { type: String, default: null },
    subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", default: [] }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.index({ subCategory: 1 });
categorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Category", categorySchema);
