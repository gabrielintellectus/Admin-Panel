//express
const express = require("express");
const route = express.Router();
const config = require("../../config");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage, limits: { fileSize: config.UPLOAD_LIMIT } });

//checkAccessWithSecretKey
const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const NotificationController = require("./notification.controller");

//get notification list
route.get(
  "/list",
  checkAccessWithSecretKey(),
  NotificationController.getNotificationList
);

//send notifications sellers or users or both
route.post(
  "/send",
  checkAccessWithSecretKey(),
  upload.single("image"),
  NotificationController.sendNotifications
);

//Send notification to particular seller
route.post(
  "/particularSeller",
  checkAccessWithSecretKey(),
  upload.single("image"),
  NotificationController.particularSellerNotification
);

module.exports = route;
