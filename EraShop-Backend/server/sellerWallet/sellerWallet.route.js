const express = require("express");
const route = express.Router();

//Controller
const SellerWalletController = require("./sellerWallet.controller");

const checkAccessWithSecretKey = require("../../util/checkAccess");

//get sellerPendingAmount list for seller
route.get("/sellerPendingAmount", checkAccessWithSecretKey(), SellerWalletController.sellerPendingAmount);

//get sellerPendingWithdrawableAmount list for seller
route.get("/sellerPendingWithdrawableAmount", checkAccessWithSecretKey(), SellerWalletController.sellerPendingWithdrawableAmount);

//get sellerPendingWithdrawalRequestedAmount list for seller
route.get(
  "/sellerPendingWithdrawalRequestedAmount",
  checkAccessWithSecretKey(),
  SellerWalletController.sellerPendingWithdrawalRequestedAmount
);

//get sellerEarningAmount list for seller
route.get("/sellerEarningAmount", checkAccessWithSecretKey(), SellerWalletController.sellerEarningAmount);

//get seller's pending, pendingWithdrawableAmount, pendingWithdrawbleRequestedAmount, totalCommissionGiven for seller and admin (seller wallet)
route.get("/getAllAmount", checkAccessWithSecretKey(), SellerWalletController.getAllAmount);

//get the seller's transaction for admin
route.get("/sellerTransaction", checkAccessWithSecretKey(), SellerWalletController.sellerTransaction);

//get sellerPendingWithdrawalRequestedAmount list for admin
route.get(
  "/sellerPendingWithdrawalRequestedAmountForAdmin",
  checkAccessWithSecretKey(),
  SellerWalletController.sellerPendingWithdrawalRequestedAmountForAdmin
);

//seller pending WithdrawalRequestedAmount given by admin to seller for admin
route.post("/byAdminToSeller", checkAccessWithSecretKey(), SellerWalletController.byAdminToSeller);

//get admin commission wallet for admin
route.get("/adminCommissionWallet", checkAccessWithSecretKey(), SellerWalletController.adminCommissionWallet);

//get date wise chartAnalytic for admin revenue
route.get("/chartAnalyticOfRevenue", checkAccessWithSecretKey(), SellerWalletController.chartAnalyticOfRevenue);

module.exports = route;
