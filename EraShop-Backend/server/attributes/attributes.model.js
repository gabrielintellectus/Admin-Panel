const mongoose = require("mongoose");

const attributesSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    value: { type: Array, default: [] },
    type: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

attributesSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Attributes", attributesSchema);
