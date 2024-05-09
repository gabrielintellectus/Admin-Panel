const ReportoReel = require("./reportoReel.model");

//import model
const User = require("../user/user.model");
const Reel = require("../reel/reel.model");

//report to particular reel by the user
exports.reportReel = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.reelId || !req.body.description)
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });

    const [user, reel] = await Promise.all([User.findById(req?.body?.userId), Reel.findOne({ _id: req?.body?.reelId })]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    if (!reel) {
      return res.status(200).json({ satus: false, message: "reel does not found!" });
    }

    const reportoReel = new ReportoReel();

    reportoReel.userId = user?._id;
    reportoReel.reelId = reel?._id;
    reportoReel.description = req?.body?.description;
    reportoReel.reportDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    await reportoReel.save();

    return res.status(200).json({ status: true, message: "finally, report to particular reel by the user." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//get all reported reels for admin
exports.reportsOfReel = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const [totalReportOfReels, reportOfReels] = await Promise.all([
      ReportoReel.find().countDocuments(),
      ReportoReel.find()
        .populate("reelId", "video videoType thumbnail thumbnailType")
        .populate("userId", "firstName lastName image")
        .sort({ createdAt: -1 })
        .skip((start - 1) * limit)
        .limit(limit),
    ]);

    return res.status(200).json({
      status: true,
      message: reportOfReels.length > 0 ? "finally, reports of the reels get by the admin." : "Reports of the reels not found.",
      totalReportOfReels: totalReportOfReels,
      reportOfReels: reportOfReels,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};
