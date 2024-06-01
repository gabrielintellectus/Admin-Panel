//express
const express = require("express");
const route = express.Router();
const config = require("../../config");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage, limits: { fileSize: config.UPLOAD_LIMIT } });

//admin middleware
const AdminMiddleware = require("../middleware/admin.middleware");

//controller
const AdminController = require("./admin.controller");

//create admin
route.post("/create", upload.single("image"), AdminController.store);

//admin login
route.post("/login", AdminController.login);

//update purchase code
route.patch("/updateCode", AdminController.updateCode);

//get admin profile
route.get("/profile", AdminMiddleware, AdminController.getProfile);

//update admin profile email and name
route.patch("/updateProfile", AdminMiddleware, AdminController.update);

//update admin Profile Image
route.patch(
  "/updateImage",
  AdminMiddleware,
  upload.single("image"),
  AdminController.updateImage
);

//send email for forgot the password (forgot password)
route.post("/forgotPassword", AdminController.forgotPassword);

//update admin password
route.patch("/updatePassword", AdminMiddleware, AdminController.updatePassword);

//set password
route.post("/setPassword", AdminController.setPassword);

module.exports = route;
