const Notification = require("./notification.model");

//import model
const User = require("../user/user.model");
const Seller = require("../seller/seller.model");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//get notification list
exports.getNotificationList = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const [user, notification] = await Promise.all([
      User.findById(req.query.userId),
      Notification.find({ userId: req.query.userId }).sort({ createdAt: -1 }),
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    if (user.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by admin!" });
    }

    return res.status(200).json({
      status: true,
      message: "finally, get the notification list by the user!",
      notification,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//send notifications sellers or users or both
exports.sendNotifications = async (req, res) => {
  try {
    if (req.query.notificationType.trim() === "User") {
      const userId = await User.find({ isBlock: false }).distinct("_id");

      await userId.map(async (data) => {
        const notification = new Notification();

        notification.userId = data._id;
        notification.title = req.body.title;
        notification.message = req.body.message;
        notification.image = req.file ? config.baseURL + req.file.path : "";
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        await notification.save();
      });

      const userFCM = await User.find({ isBlock: false }).distinct("fcmToken");
      console.log("fcmToken in user: ", userFCM);

      const payload = {
        registration_ids: userFCM,
        notification: {
          title: req.body.title,
          body: req.body.message,
        },
      };

      await fcm.send(payload, async (error, response) => {
        if (error) {
          console.log("Something has gone wrong: ", error);
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      return res.status(200).json({ status: true, message: "Success" });
    } else if (req.query.notificationType.trim() === "Seller") {
      const sellerId = await Seller.find({ isBlock: false }).distinct("_id");

      await sellerId.map(async (data) => {
        const notification = new Notification();

        notification.sellerId = data._id;
        notification.title = req.body.title;
        notification.message = req.body.message;
        notification.image = req.file ? config.baseURL + req.file.path : "";
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        await notification.save();
      });

      const sellerFCM = await Seller.find({ isBlock: false }).distinct("fcmToken");
      console.log("fcmToken in user: ", sellerFCM);

      const payload = {
        registration_ids: sellerFCM,
        notification: {
          title: req.body.title,
          body: req.body.message,
        },
      };

      await fcm.send(payload, async (error, response) => {
        if (error) {
          console.log("Something has gone wrong: ", error);
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      return res.status(200).json({ status: true, message: "Success" });
    } else if (req.query.notificationType.trim() === "Both") {
      const userIds = await User.find({ isBlock: false }).distinct("_id");

      // Send notifications to users
      await Promise.all(
        userIds.map(async (userId) => {
          const notification = new Notification();

          notification.userId = userId._id;
          notification.title = req.body.title;
          notification.message = req.body.message;
          notification.image = req.file ? config.baseURL + req.file.path : "";
          notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
          await notification.save();
        })
      );

      const userFCM = await User.find({ isBlock: false }).distinct("fcmToken");
      console.log("fcmToken in user: ", userFCM);

      const userPayload = {
        registration_ids: userFCM,
        notification: {
          title: req.body.title,
          body: req.body.message,
        },
      };

      await fcm.send(userPayload, async (error, response) => {
        if (error) {
          console.log("Something has gone wrong: ", error);
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      // Send notifications to sellers
      const sellerIds = await Seller.find({ isBlock: false }).distinct("_id");

      await Promise.all(
        sellerIds.map(async (sellerId) => {
          const notification = new Notification();

          notification.sellerId = sellerId._id;
          notification.title = req.body.title;
          notification.message = req.body.message;
          notification.image = req.file ? config.baseURL + req.file.path : "";
          notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
          await notification.save();
        })
      );

      const sellerFCM = await Seller.find({ isBlock: false }).distinct("fcmToken");
      console.log("fcmToken in user: ", sellerFCM);

      const sellerPayload = {
        registration_ids: sellerFCM,
        notification: {
          title: req.body.title,
          body: req.body.message,
        },
      };

      await fcm.send(sellerPayload, async (error, response) => {
        if (error) {
          console.log("Something has gone wrong: ", error);
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      return res.status(200).json({ status: true, message: "Success" });
    } else {
      return res.status(200).json({ status: false, message: "please pass the valid notificationType!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//send notification to particular seller
exports.particularSellerNotification = async (req, res) => {
  try {
    if (!req.query.sellerId) {
      return res.status(200).json({ status: false, message: "sellerId must be requried!" });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!" });
    }

    const payload = {
      to: seller.fcmToken,
      notification: {
        body: req.body.message,
        title: req.body.title,
        image: req.file ? config.baseURL + req.file.path : "",
      },
    };

    const notification = new Notification();

    notification.sellerId = seller._id;
    notification.title = req.body.title;
    notification.message = req.body.message;
    notification.image = req.file ? config.baseURL + req.file.path : "";
    notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    await notification.save();

    await fcm.send(payload, async (error, response) => {
      if (error) {
        console.log("Something has gone wrong: ", error);
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });

    return res.status(200).json({ status: true, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};
