//express
const express = require("express");
const route = express.Router();

const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const liveSellerController = require("./liveSeller.controller");

//live the seller for live Selling
route.post("/", checkAccessWithSecretKey(), liveSellerController.liveSeller);

//get live seller list
route.get("/liveSellerList", checkAccessWithSecretKey(), liveSellerController.getliveSellerList);

//get selectedProducts for the user
route.get("/getSelectedProducts", checkAccessWithSecretKey(), liveSellerController.getSelectedProducts);

module.exports = route;
