const mongoose = require("mongoose");

const reportReelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reelId: { type: mongoose.Schema.Types.ObjectId, ref: "Reel" },
    description: { type: String, default: "" },
    reportDate: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reportReelSchema.index({ userId: 1 });
reportReelSchema.index({ reelId: 1 });
reportReelSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ReportReel", reportReelSchema);
