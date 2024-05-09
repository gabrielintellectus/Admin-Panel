//express
const express = require("express");
const route = express.Router();

const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const ReportToReelController = require("./reportoReel.controller");

//report to particular reel by the user
route.post("/reportReel", checkAccessWithSecretKey(), ReportToReelController.reportReel);

//get all reported reels for admin
route.get("/reportsOfReel", checkAccessWithSecretKey(), ReportToReelController.reportsOfReel);

module.exports = route;
