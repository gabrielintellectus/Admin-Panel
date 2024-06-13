const express = require("express");
const route = express.Router();

//Controller
const paymentController = require("./payment.controller");

const checkAccessWithSecretKey = require("../../util/checkAccess");

//create payment by the user
route.post("/create", checkAccessWithSecretKey(), paymentController.createPayment);

//stripe webHook
route.post("/stripeWebHook", paymentController.stripeWebHook);

module.exports = route;
