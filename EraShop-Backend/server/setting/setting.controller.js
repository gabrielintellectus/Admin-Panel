const Setting = require("./setting.model");

//create Setting
exports.store = async (req, res) => {
  try {
    const setting = new Setting();

    setting.zegoAppId = req.body.zegoAppId;
    await setting.save();

    return res.status(200).json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//update Setting
exports.update = async (req, res) => {
  try {
    if (!req.query.settingId) return res.status(200).json({ status: false, message: "SettingId is requried!!" });

    const setting = await Setting.findById(req.query.settingId);
    if (!setting) {
      return res.status(200).json({ status: false, message: "Setting does not found!!" });
    }

    setting.paymentGateway = req.body.paymentGateway ? req.body.paymentGateway : setting.paymentGateway;

    setting.privacyPolicyLink = req.body.privacyPolicyLink ? req.body.privacyPolicyLink : setting.privacyPolicyLink;
    setting.privacyPolicyText = req.body.privacyPolicyText ? req.body.privacyPolicyText : setting.privacyPolicyText;

    setting.zegoAppId = req.body.zegoAppId ? req.body.zegoAppId : setting.zegoAppId;
    setting.zegoAppSignIn = req.body.zegoAppSignIn ? req.body.zegoAppSignIn : setting.zegoAppSignIn;

    setting.stripePublishableKey = req.body.stripePublishableKey ? req.body.stripePublishableKey : setting.stripePublishableKey;
    setting.stripeSecretKey = req.body.stripeSecretKey ? req.body.stripeSecretKey : setting.stripeSecretKey;

    setting.razorPayId = req.body.razorPayId ? req.body.razorPayId : setting.razorPayId;
    setting.razorSecretKey = req.body.razorSecretKey ? req.body.razorSecretKey : setting.razorSecretKey;

    setting.adminCommissionCharges = parseInt(req.body.adminCommissionCharges)
      ? parseInt(req.body.adminCommissionCharges)
      : setting.adminCommissionCharges;

    setting.cancelOrderCharges = parseInt(req.body.cancelOrderCharges) ? parseInt(req.body.cancelOrderCharges) : setting.cancelOrderCharges;

    setting.withdrawCharges = parseInt(req.body.withdrawCharges) ? parseInt(req.body.withdrawCharges) : setting.withdrawCharges;

    setting.withdrawLimit = parseInt(req.body.withdrawLimit) ? parseInt(req.body.withdrawLimit) : setting.withdrawLimit;

    await setting.save();

    return res.status(200).json({
      status: true,
      message: "Setting Updated Successfully!!",
      setting,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//get setting
exports.index = async (req, res) => {
  try {
    const setting = await Setting.find().sort({ createdAt: -1 });
    if (!setting) {
      return res.status(200).json({ status: false, message: "Setting does not found!!" });
    }

    return res.status(200).json({ status: true, message: "Success!!", setting: setting[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//handle setting switch
exports.handleSwitch = async (req, res) => {
  try {
    if (!req.query.settingId || !req.query.type) return res.status(200).json({ status: false, message: "OOps ! Invalid details!!" });

    const setting = await Setting.findById(req.query.settingId);
    if (!setting) return res.status(200).json({ status: false, message: "Setting does not found!!" });

    if (req.query.type === "stripe") {
      setting.stripeSwitch = !setting.stripeSwitch;
    } else if (req.query.type === "razorPay") {
      setting.razorPaySwitch = !setting.razorPaySwitch;
    } else if (req.query.type === "productRequest") {
      setting.isAddProductRequest = !setting.isAddProductRequest;
    } else if (req.query.type === "updateProductRequest") {
      setting.isUpdateProductRequest = !setting.isUpdateProductRequest;
    } else if (req.query.type === "isFakeData") {
      setting.isFakeData = !setting.isFakeData;
    } else {
      return res.status(200).json({ status: false, message: "type passed must be valid!" });
    }

    await setting.save();

    return res.status(200).json({ status: true, message: "Success", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};
