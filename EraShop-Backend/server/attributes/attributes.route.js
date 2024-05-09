//express
const express = require("express");
const route = express.Router();

const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const attributesController = require("./attributes.controller");

//create attributes
route.post("/create", checkAccessWithSecretKey(), attributesController.store);

//update attributes
route.patch("/update", checkAccessWithSecretKey(), attributesController.update);

//delete attributes
route.delete("/delete", checkAccessWithSecretKey(), attributesController.destroy);

//get attributes
route.get("/", checkAccessWithSecretKey(), attributesController.get);

//type wise get attributes
route.get("/typeWise", checkAccessWithSecretKey(), attributesController.typeWise);

module.exports = route;
