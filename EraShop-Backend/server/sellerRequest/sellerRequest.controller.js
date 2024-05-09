const Request = require("./sellerRequest.model");

//fs
const fs = require("fs");

//import model
const User = require("../user/user.model");
const Seller = require("../seller/seller.model");

//config
const config = require("../../config");

//deleteFile
const { deleteFile } = require("../../util/deleteFile");

//create request by user
exports.storeRequest = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.mobileNumber) {
      return res.status(200).json({ status: false, message: "OOps ! Invalid details!" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!!" });
    }

    const existRequest = await Request.findOne({ userId: user._id });

    if (existRequest?.mobileNumber === req?.body?.mobileNumber.toString()) {
      return res.status(200).json({
        status: true,
        message:
          "A seller request has already been generated for the provided mobile number, You cannot create another seller request using the same number.",
      });
    }

    if (existRequest?.isAccepted === false) {
      return res.status(200).json({
        status: true,
        message: "You have already sent seller request!",
      });
    }

    if (existRequest?.isAccepted === true) {
      const seller = await Seller.findOne({ uniqueId: existRequest.uniqueId });
      const isAccepted = await existRequest.isAccepted;

      if (!seller) {
        return res.status(200).json({
          status: false,
          message: "this user does not become the seller!",
        });
      }

      return res.status(200).json({
        status: false,
        message: "this user already become the Seller!",
        seller,
        isAccepted,
      });
    }

    const request = new Request();

    request.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    request.lastName = req.body.lastName ? req.body.lastName : user.lastName;
    request.businessTag = req.body.businessTag ? req.body.businessTag : user.businessTag;
    request.businessName = req.body.businessName ? req.body.businessName : user.businessName;
    request.mobileNumber = req.body.mobileNumber;
    request.userId = user._id;
    request.email = user.email;
    request.password = user.password;
    request.uniqueId = user.uniqueId;
    request.image = user.image;
    request.gender = user.gender;
    request.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    request.fcmToken = user.fcmToken;

    //seller's address fields
    request.address.address = req.body.address ? req.body.address : request.address.address;
    request.address.landMark = req.body.landMark ? req.body.landMark : request.address.landMark;
    request.address.city = req.body.city ? req.body.city : request.address.city;
    request.address.pinCode = parseInt(req.body.pinCode) ? parseInt(req.body.pinCode) : request.address.pinCode;
    request.address.state = req.body.state ? req.body.state : request.address.state;
    request.address.country = req.body.country ? req.body.country : request.address.country;

    //seller's bankDetails fields
    request.bankDetails.bankBusinessName = req.body.bankBusinessName ? req.body.bankBusinessName : request.bankDetails.bankBusinessName;
    request.bankDetails.bankName = req.body.bankName ? req.body.bankName : request.bankDetails.bankName;
    request.bankDetails.accountNumber = parseInt(req.body.accountNumber)
      ? parseInt(req.body.accountNumber)
      : request.bankDetails.accountNumber;
    request.bankDetails.IFSCCode = req.body.IFSCCode ? req.body.IFSCCode : request.bankDetails.IFSCCode;
    request.bankDetails.branchName = req.body.branchName ? req.body.branchName : request.bankDetails.branchName;

    await request.save();

    const isAccepted = await request.isAccepted;

    return res.status(200).json({
      status: true,
      message: "Seller request sent successfully!!",
      request,
      isAccepted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//check seller become or not
exports.sellerBecomeOrNot = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(200).json({ status: false, message: "OOps ! Invalid details!" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!!" });
    }

    const existRequest = await Request.findOne({ userId: user._id });

    if (existRequest?.isAccepted === false) {
      return res.status(200).json({
        status: true,
        message: "You have already sent seller request!",
      });
    }

    if (existRequest?.isAccepted === true) {
      const seller = await Seller.findOne({ uniqueId: existRequest.uniqueId });
      const isAccepted = await existRequest.isAccepted;

      if (!seller) {
        return res.status(200).json({
          status: false,
          message: "this user does not become the seller!",
        });
      }

      return res.status(200).json({
        status: false,
        message: "this user already become the Seller!",
        seller,
        isAccepted,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//update request by admin
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.query.requestId);
    if (!request) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "request does not found!!" });
    }

    if (req.file) {
      const image = request.image.split("storage");

      if (image) {
        if (fs.existsSync("storage" + image[1])) {
          fs.unlinkSync("storage" + image[1]);
        }

        request.image = config.baseURL + req.file.path;
      }
    }

    request.firstName = req.body.firstName ? req.body.firstName : request.firstName;
    request.lastName = req.body.lastName ? req.body.lastName : request.lastName;
    request.gender = req.body.gender ? req.body.gender : request.gender;
    request.mobileNumber = req.body.mobileNumber ? req.body.mobileNumber : request.mobileNumber;
    request.businessName = req.body.businessName ? req.body.businessName : request.businessName;
    request.businessTag = req.body.businessTag ? req.body.businessTag : request.businessTag;

    //Update the seller's address fields
    request.address.address = req.body.address ? req.body.address : request.address.address;
    request.address.landMark = req.body.landMark ? req.body.landMark : request.address.landMark;
    request.address.city = req.body.city ? req.body.city : request.address.city;
    request.address.pinCode = parseInt(req.body.pinCode) ? parseInt(req.body.pinCode) : request.address.pinCode;
    request.address.state = req.body.state ? req.body.state : request.address.state;
    request.address.country = req.body.country ? req.body.country : request.address.country;

    //Update the seller's bankDetails fields
    request.bankDetails.bankBusinessName = req.body.bankBusinessName ? req.body.bankBusinessName : request.bankDetails.bankBusinessName;
    request.bankDetails.bankName = req.body.bankName ? req.body.bankName : request.bankDetails.bankName;
    request.bankDetails.accountNumber = parseInt(req.body.accountNumber)
      ? parseInt(req.body.accountNumber)
      : request.bankDetails.accountNumber;
    request.bankDetails.IFSCCode = req.body.IFSCCode ? req.body.IFSCCode : request.bankDetails.IFSCCode;
    request.bankDetails.branchName = req.body.branchName ? req.body.branchName : request.bankDetails.branchName;

    await request.save();

    return res.status(200).json({
      status: true,
      message: "request updated by admin.",
      request: request,
    });
  } catch (error) {
    console.log(error);
    if (req.file) deleteFile(req.file);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//seller request accept or not by admin
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.query.requestId);
    if (!request) return res.status(200).json({ status: false, message: "Seller request does not found!!" });

    if (request.isAccepted === true) {
      return res.status(200).json({
        status: false,
        message: "Seller request already accepted by the admin!",
      });
    }

    request.isAccepted = true;
    await request.save();

    const user = await User.findById(request.userId);

    user.isSeller = true;
    await user.save();

    const seller = new Seller();

    seller.firstName = request.firstName;
    seller.lastName = request.lastName;
    seller.businessName = request.businessName;
    seller.fcmToken = request.fcmToken;
    seller.businessTag = request.businessTag;
    seller.mobileNumber = request.mobileNumber;
    seller.image = request.image;
    seller.gender = request.gender;
    seller.email = request.email;
    seller.password = request.password;
    seller.fcmToken = request.fcmToken;
    seller.identity = user.identity;
    seller.uniqueId = user.uniqueId;
    seller.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    //seller's address fields
    seller.address.address = request.address.address;
    seller.address.landMark = request.address.landMark;
    seller.address.city = request.address.city;
    seller.address.pinCode = request.address.pinCode;
    seller.address.state = request.address.state;
    seller.address.country = request.address.country;

    //seller's bankDetails fields
    seller.bankDetails.bankBusinessName = request.bankDetails.bankBusinessName;
    seller.bankDetails.bankName = request.bankDetails.bankName;
    seller.bankDetails.accountNumber = request.bankDetails.accountNumber;
    seller.bankDetails.IFSCCode = request.bankDetails.IFSCCode;
    seller.bankDetails.branchName = request.bankDetails.branchName;

    seller.userId = user?._id;
    await seller.save();

    return res.status(200).json({
      status: true,
      message: "Seller request accepted and become the seller!",
      request: request,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//get the all request for admin
exports.getRequest = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const [totalrequest, request] = await Promise.all([
      Request.find({ isAccepted: false }).countDocuments(),
      Request.find({ isAccepted: false })
        .sort({ createdAt: -1 })
        .skip((start - 1) * limit)
        .limit(limit),
    ]);

    return res.status(200).json({
      status: true,
      message: "all requests get successfully.",
      totalrequest,
      request,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Sever Error",
    });
  }
};
