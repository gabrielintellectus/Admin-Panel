const Order = require("./order.model");

//import model
const Cart = require("../cart/cart.model");
const User = require("../user/user.model");
const Product = require("../product/product.model");
const Seller = require("../seller/seller.model");
const SellerWallet = require("../sellerWallet/sellerWallet.model");
const Setting = require("../setting/setting.model");
const Address = require("../address/address.model");
const PromoCode = require("../promoCode/promoCode.model");
const PromoCodeCheck = require("../promoCodeCheck/promoCodeCheck.model");
const Notification = require("../notification/notification.model");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//create order by the user
exports.createOrder = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.paymentGateway || !req.body.finalTotal) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const [user, dataFromCart] = await Promise.all([
      User.findById(req.query.userId),
      Cart.findOne({ userId: req.query.userId })
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    if (user.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by the admin." });
    }

    if (!dataFromCart) {
      return res.status(200).json({
        status: false,
        message: "Cart does not found for this user.",
      });
    }

    if (dataFromCart.items.length === 0) {
      return res.status(200).json({ status: false, message: "Items does not found in cart." });
    }

    //promoCode validation for user
    var promoCode;
    var discount;
    var discountedTotal;

    //add data in body from cart
    const data = req.body;

    if (req.body.promoCode) {
      promoCode = await PromoCode.findOne({ promoCode: req.body.promoCode });
      if (!promoCode) {
        return res.status(200).json({ status: false, message: "promoCode does not found." });
      }

      var promoCodeCheck;
      promoCodeCheck = await PromoCodeCheck.findOne({ promoCodeId: promoCode._id, userId: dataFromCart.userId });

      if (promoCodeCheck) {
        return res.status(200).json({
          status: false,
          message: "promoCode already used by this user.",
        });
      }

      if (promoCode.discountType === 1) {
        //percentage discount
        discount = (dataFromCart.total * promoCode.discountAmount) / 100;
        discountedTotal = dataFromCart.total - (dataFromCart.total * promoCode.discountAmount) / 100;

        console.log("d-1 percentage:  discountedTotal  ", discountedTotal);
        console.log("d-1 percentage:  req.body.finalTotal  ", req.body.finalTotal);

        if (req.body.finalTotal !== discountedTotal) {
          console.log("come in d-1");

          return res.status(200).json({
            status: false,
            message: "Invalid finalTotal amount after applying the promo code!",
          });
        }

        dataFromCart.finalTotal = req.body.finalTotal;
      } else if (promoCode.discountType === 0) {
        //flat discount
        discount = promoCode.discountAmount;
        discountedTotal = dataFromCart.total - promoCode.discountAmount;

        console.log("d-2 flat:  discountedTotal", discountedTotal);
        console.log("d-2 flat:  req.body.finalTotal", req.body.finalTotal);

        if (parseInt(req.body.finalTotal) !== discountedTotal) {
          return res.status(400).json({
            status: false,
            message: "Invalid finalTotal amount after applying the promoCode!",
          });
        }

        dataFromCart.finalTotal = parseInt(req.body.finalTotal);
      }

      if (!promoCodeCheck) {
        promoCodeCheck = new PromoCodeCheck();

        promoCodeCheck.promoCodeId = promoCode._id;
        promoCodeCheck.userId = user._id;
        await promoCodeCheck.save();
      }

      //promoCode
      data.promoCode = {};
      data.promoCode.promoCode = promoCode.promoCode;
      data.promoCode.discountType = promoCode.discountType;
      data.promoCode.discountAmount = promoCode.discountAmount;
      data.promoCode.conditions = promoCode.conditions;

      let quantityTotal = 0;
      for (let i = 0; i < dataFromCart.items.length; i++) {
        quantityTotal += dataFromCart.items[i].productQuantity;
      }
      data.totalQuantity = parseInt(quantityTotal);
      data.items = dataFromCart.items;
      data.totalItems = dataFromCart.totalItems;
      data.totalShippingCharges = dataFromCart.totalShippingCharges;
      data.userId = dataFromCart.userId;
      data.paymentGateway = req.query.paymentGateway;
      data.discount = discount;
      data.subTotal = dataFromCart.subTotal;
      data.total = dataFromCart.total;
      data.finalTotal = dataFromCart.finalTotal;
      data.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      //generate unique orderId
      const orderId = "INV#" + Math.floor(10000 + Math.random() * 90000);
      data.orderId = orderId;

      //shipping address stored which selected by user
      const [orderAddress, setting] = await Promise.all([
        Address.findOne({ userId: dataFromCart.userId, isSelect: true }),
        Setting.findOne().sort({ createdAt: -1 })
      ]);

      data.shippingAddress = {};
      data.shippingAddress.name = orderAddress?.name;
      data.shippingAddress.country = orderAddress?.country;
      data.shippingAddress.state = orderAddress?.state;
      data.shippingAddress.city = orderAddress?.city;
      data.shippingAddress.zipCode = orderAddress?.zipCode;
      data.shippingAddress.address = orderAddress?.address;

      //adminCommissionCharges
      const purchasedTimeadminCommissionCharges = setting.adminCommissionCharges;
      data.purchasedTimeadminCommissionCharges = purchasedTimeadminCommissionCharges;

      const order = new Order(data);

      //Set the status "Pending" and date of each item in the "items" array
      order.items.forEach((item) => {
        item.status = "Pending";
        item.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      });

      //create sellerWallet history for the order with type 1 and status "Pending"
      for (let i = 0; i < order.items.length; i++) {
        const product = await Product.findById(order.items[i].productId);
        const seller = await Seller.findById(product.seller);

        const purchasedTimeProductPrice = parseInt(order.items[i].purchasedTimeProductPrice);
        const productQuantity = parseInt(order.items[i].productQuantity);
        const attributesArray = order.items[i].attributesArray;
        const itemId = order.items[i]._id;

        //calculate adminCommission on purchasedTimeProductPrice
        const adminCommission = (purchasedTimeProductPrice * order.purchasedTimeadminCommissionCharges) / 100; //the admin commission is ___% of the productPrice

        //admin commission earned per productQuantity (seller commission given per productQuantity)
        const commissionPerProductQuantity = adminCommission * productQuantity;

        //sellerEarning per productQuantity after deduction of admin commission per productQuantity
        const sellerEarning = purchasedTimeProductPrice * productQuantity - adminCommission * productQuantity;

        const updateRecordIndex = order.items.findIndex(
          (item) =>
            item?.productId.toString() === product._id.toString() &&
            item?.sellerId.toString() === seller._id.toString() &&
            JSON.stringify(item?.attributesArray) === JSON.stringify(attributesArray)
        );
        console.log("updateRecordIndex: ", updateRecordIndex);

        if (updateRecordIndex !== -1) {
          order.items[updateRecordIndex].commissionPerProductQuantity = commissionPerProductQuantity;
          await Order.findOneAndUpdate({ _id: order._id }, { items: order.items }, { new: true });
        }

        const sellerWallet = new SellerWallet();

        sellerWallet.orderId = order._id;
        sellerWallet.itemId = itemId;
        sellerWallet.productId = product._id;
        sellerWallet.sellerId = seller._id;
        sellerWallet.amount = sellerEarning;
        sellerWallet.commissionPerProductQuantity = commissionPerProductQuantity;
        sellerWallet.type = 1;
        sellerWallet.status = "Pending";
        sellerWallet.paymentGateway = req.query.paymentGateway;
        sellerWallet.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await sellerWallet.save();

        //notification related
        if (!seller.isBlock) {
          const payload = {
            to: seller.fcmToken,
            notification: {
              title: `Thank You for Your Order: ${user.firstName}'s Order Placed Successfully!`,
              body: "Order In Progress: We're Working on It!",
            },
          };

          const notification = new Notification();

          notification.userId = dataFromCart.userId;
          notification.image = user.image;
          notification.sellerId = seller._id;
          notification.productId = product._id;
          notification.title = payload.notification.title;
          notification.message = payload.notification.body;
          notification.notificationType = 1;
          notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

          await notification.save();

          await fcm.send(payload, async (error, response) => {
            if (error) {
              console.log("Something has gone wrong: ", error);
            } else {
              console.log("Successfully sent with response: ", response);
            }
          });
        }
      }

      await order.save();

      const populateOrder = await order.populate({
        path: "items.productId",
        select: {
          productName: 1,
          mainImage: 1,
          _id: 1,
        },
      });

      //after order done cart updated
      await Cart.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            items: [],
            totalShippingCharges: 0,
            subTotal: 0,
            total: 0,
            finalTotal: 0,
            totalItems: 0,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message:
          "Order placed Successfully, Payment history created and seller's pendingAmount updated and calculate adminCommissionEarned",
        data: populateOrder,
      });
    } else {
      let quantityTotal = 0;
      for (let i = 0; i < dataFromCart.items.length; i++) {
        quantityTotal += dataFromCart.items[i].productQuantity;
      }
      data.totalQuantity = parseInt(quantityTotal);
      data.items = dataFromCart.items;
      data.totalItems = dataFromCart.totalItems;
      data.totalShippingCharges = dataFromCart.totalShippingCharges;
      data.userId = dataFromCart.userId;
      data.paymentGateway = req.query.paymentGateway;
      data.subTotal = dataFromCart.subTotal;
      data.total = dataFromCart.total;

      if (parseInt(req.body.finalTotal) !== data.total) {
        return res.status(200).json({
          status: false,
          message: "Invalid finalTotal amount without applying the promo code!",
        });
      }

      data.finalTotal = parseInt(req.body.finalTotal);

      //generate unique orderId
      const orderId = "INV#" + Math.floor(10000 + Math.random() * 90000);
      data.orderId = orderId;

      //shipping address stored which selected by user
      const [orderAddress, setting] = await Promise.all([
        Address.findOne({ userId: dataFromCart.userId, isSelect: true }),
        Setting.findOne().sort({ createdAt: -1 })
      ]);

      data.shippingAddress = {};
      data.shippingAddress.name = orderAddress?.name;
      data.shippingAddress.country = orderAddress?.country;
      data.shippingAddress.state = orderAddress?.state;
      data.shippingAddress.city = orderAddress?.city;
      data.shippingAddress.zipCode = orderAddress?.zipCode;
      data.shippingAddress.address = orderAddress?.address;

      //adminCommissionCharges
      const purchasedTimeadminCommissionCharges = setting.adminCommissionCharges;
      data.purchasedTimeadminCommissionCharges = purchasedTimeadminCommissionCharges;

      const order = new Order(data);

      //Set the status "Pending" and date of each item in the "items" array
      order.items.forEach((item) => {
        item.status = "Pending";
        item.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      });

      //create sellerWallet history for the order with type 1 and status "Pending"
      for (let i = 0; i < order.items.length; i++) {
        const product = await Product.findById(order.items[i].productId);
        const seller = await Seller.findById(product.seller);

        const purchasedTimeProductPrice = parseInt(order.items[i].purchasedTimeProductPrice);
        const productQuantity = parseInt(order.items[i].productQuantity);
        const attributesArray = order.items[i].attributesArray;
        const itemId = order.items[i]._id;

        //calculate adminCommission on purchasedTimeProductPrice
        const adminCommission = (purchasedTimeProductPrice * order.purchasedTimeadminCommissionCharges) / 100; //the admin commission is ___% of the productPrice

        //admin commission earned per productQuantity (seller commission given per productQuantity)
        const commissionPerProductQuantity = adminCommission * productQuantity;

        //sellerEarning per productQuantity after deduction of admin commission per productQuantity
        const sellerEarning = purchasedTimeProductPrice * productQuantity - adminCommission * productQuantity;

        const updateRecordIndex = order.items.findIndex(
          (item) =>
            item?.productId.toString() === product._id.toString() &&
            item?.sellerId.toString() === seller._id.toString() &&
            JSON.stringify(item?.attributesArray) === JSON.stringify(attributesArray)
        );
        console.log("updateRecordIndex: ", updateRecordIndex);

        if (updateRecordIndex !== -1) {
          order.items[updateRecordIndex].commissionPerProductQuantity = commissionPerProductQuantity;
          await Order.findOneAndUpdate({ _id: order._id }, { items: order.items }, { new: true });
        }

        const sellerWallet = new SellerWallet();

        sellerWallet.orderId = order._id;
        sellerWallet.itemId = itemId;
        sellerWallet.productId = product._id;
        sellerWallet.sellerId = seller._id;
        sellerWallet.amount = sellerEarning;
        sellerWallet.commissionPerProductQuantity = commissionPerProductQuantity;
        sellerWallet.type = 1;
        sellerWallet.status = "Pending";
        sellerWallet.paymentGateway = req.query.paymentGateway;
        sellerWallet.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await sellerWallet.save();

        //notification related
        if (!seller.isBlock) {
          const payload = {
            to: seller.fcmToken,
            notification: {
              title: `Thank You for Your Order: ${user.firstName}'s Order Placed Successfully!`,
              body: "Order In Progress: We're Working on It!",
            },
          };

          const notification = new Notification();

          notification.userId = dataFromCart.userId;
          notification.image = user.image;
          notification.sellerId = seller._id;
          notification.productId = product._id;
          notification.title = payload.notification.title;
          notification.message = payload.notification.body;
          notification.notificationType = 1;
          notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

          await notification.save();

          await fcm.send(payload, async (error, response) => {
            if (error) {
              console.log("Something has gone wrong: ", error);
            } else {
              console.log("Successfully sent with response: ", response);
            }
          });
        }
      }

      await order.save();

      const populateOrder = await order.populate({
        path: "items.productId",
        select: {
          productName: 1,
          mainImage: 1,
          _id: 1,
        },
      });

      //after order done cart updated
      await Cart.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            items: [],
            totalShippingCharges: 0,
            subTotal: 0,
            total: 0,
            finalTotal: 0,
            totalItems: 0,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message:
          "Order placed Successfully, Payment history created and seller's pendingAmount updated and calculate adminCommissionEarned",
        data: populateOrder,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};

//update status wise the order by seller and admin
exports.updateOrder = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.orderId || !req.query.status || !req.query.itemId) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const [user, findOrder] = await Promise.all([
      User.findById(req.query.userId),
      Order.findById(req.query.orderId)
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!!" });
    }

    if (user.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by the admin." });
    }

    if (!findOrder)
      return res.status(200).json({
        status: false,
        message: "Order does not found.",
      });

    if (findOrder.userId.toString() !== user._id.toString())
      return res.status(200).json({
        status: false,
        message: "This order does not belongs to your account.",
      });

    const itemToUpdate = findOrder.items.find((item) => item._id.toString() === req?.query?.itemId.toString());
    if (!itemToUpdate) {
      return res.status(200).json({ status: false, message: "Item does not found in the order." });
    }
    //console.log("itemToUpdate: ", itemToUpdate);

    if (req.query.status === "Pending") {
      if (itemToUpdate.status === "Pending")
        return res.status(200).json({
          status: false,
          message: "This order is already in Pending",
        });

      if (itemToUpdate.status === "Confirmed")
        return res.status(200).json({
          status: false,
          message: "This order is already Confirmed, after completion you can't update it to Pending",
        });

      if (itemToUpdate.status === "Out Of Delivery")
        return res.status(200).json({
          status: false,
          message: "This order is already Out Of Delivery, after completion you can't update it to Pending",
        });

      if (itemToUpdate.status === "Delivered")
        return res.status(200).json({
          status: false,
          message: "This order is already Delivered, after completion you can't update it to Pending",
        });

      if (itemToUpdate.status === "Cancelled")
        return res.status(200).json({
          status: false,
          message: "This order is already Cancelled , after cancellation you can't update it to Pending",
        });
    } else if (req.query.status === "Confirmed") {
      if (itemToUpdate.status === "Confirmed")
        return res.status(200).json({
          status: false,
          message: "This order is already Confirmed",
        });

      if (itemToUpdate.status === "Out Of Delivery")
        return res.status(200).json({
          status: false,
          message: "This order is already Out Of Delivery, after completion you can't update it to Confirmed",
        });

      if (itemToUpdate.status === "Delivered")
        return res.status(200).json({
          status: false,
          message: "This order is already Delivered, after completion you can't update it to Confirmed",
        });

      if (itemToUpdate.status === "Cancelled")
        return res.status(200).json({
          status: false,
          message: "This order is already Cancelled, after cancellation you can't update it to Confirmed",
        });

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: findOrder._id, "items._id": itemToUpdate._id },
        { $set: { "items.$.status": "Confirmed" } },
        { new: true }
      );

      //notification related
      if (!user.isBlock) {
        const payload = {
          to: user.fcmToken,
          notification: {
            title: `your Order item status has been updated to Confirmed!`,
          },
        };

        const notification = new Notification();

        notification.userId = findOrder.userId;
        notification.image = user.image;
        notification.sellerId = itemToUpdate.sellerId;
        notification.productId = itemToUpdate.productId;
        notification.message = payload.notification.title;
        notification.notificationType = 2;
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await notification.save();

        await fcm.send(payload, async (error, response) => {
          if (error) {
            console.log("Something has gone wrong: ", error);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }

      const data = await Order.findOne({ _id: updatedOrder._id })
        .populate({
          path: "items.productId",
          select: "productName mainImage _id",
        })
        .populate({
          path: "items.sellerId",
          select: "firstName lastName businessName",
        })
        .populate({
          path: "userId",
          select: "firstName lastName uniqueId",
        });

      return res.status(200).json({
        status: true,
        message: "finally, Order item status has been updated to Confirmed",
        data: data,
      });
    } else if (req.query.status === "Out Of Delivery") {
      if (!req.body.deliveredServiceName || !req.body.trackingId || !req.body.trackingLink)
        return res.status(200).json({
          status: false,
          message: "trackingId,trackingLink,deliveredServiceName must be requried!!",
        });

      if (itemToUpdate.status !== "Confirmed")
        return res.status(200).json({
          status: false,
          message: "This order is not Confirmed , after Confirmed you can update it to Out Of Delivery",
        });

      if (itemToUpdate.status === "Out Of Delivery")
        return res.status(200).json({
          status: false,
          message: "This order is already Out Of Delivery",
        });

      if (itemToUpdate.status === "Delivered")
        return res.status(200).json({
          status: false,
          message: "This order is already Delivered, after completion you can't update it to Out Of Delivery",
        });

      if (itemToUpdate.status === "Cancelled")
        return res.status(200).json({
          status: false,
          message: "This order is already Cancelled, after cancellation you can't update it to Out Of Delivery",
        });

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: findOrder._id, "items._id": itemToUpdate._id },
        {
          $set: {
            "items.$.status": "Out Of Delivery",
            "items.$.deliveredServiceName": req.body.deliveredServiceName,
            "items.$.trackingId": req.body.trackingId,
            "items.$.trackingLink": req.body.trackingLink,
          },
        },
        { new: true }
      );

      //notification related
      if (!user.isBlock) {
        const payload = {
          to: user.fcmToken,
          notification: {
            title: `your Order item status has been updated to Out Of Delivery!`,
          },
        };

        const notification = new Notification();

        notification.userId = findOrder.userId;
        notification.image = user.image;
        notification.sellerId = itemToUpdate.sellerId;
        notification.productId = itemToUpdate.productId;
        notification.message = payload.notification.title;
        notification.notificationType = 2;
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await notification.save();

        await fcm.send(payload, async (error, response) => {
          if (error) {
            console.log("Something has gone wrong: ", error);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }

      const data = await Order.findOne({ _id: updatedOrder._id })
        .populate({
          path: "items.productId",
          select: "productName mainImage _id",
        })
        .populate({
          path: "items.sellerId",
          select: "firstName lastName businessName",
        })
        .populate({
          path: "userId",
          select: "firstName lastName uniqueId",
        });

      return res.status(200).json({
        status: true,
        message: "finally, Order item status has been updated to Out Of Delivery",
        data: data,
      });
    } else if (req.query.status === "Delivered") {
      if (itemToUpdate.status === "Delivered") return res.status(200).json({ status: false, message: "This order is already Delivered" });

      if (itemToUpdate.status === "Cancelled")
        return res.status(200).json({
          status: false,
          message: "This order is already Cancelled , after cancellation you can't update it to Delivered",
        });

      if (itemToUpdate.status !== "Out Of Delivery")
        return res.status(200).json({
          status: false,
          message: "This order is not Out Of Delivery , after Out Of Delivery you can update it to Delivered",
        });

      //update the "sold" field in the product model by incrementing it by the quantity ordered
      await Product.findOneAndUpdate({ _id: itemToUpdate.productId }, { $inc: { sold: itemToUpdate.productQuantity } });

      //update existing wallet When order delivered with type 2 and status "Pending"
      await SellerWallet.findOneAndUpdate(
        {
          orderId: findOrder._id,
          itemId: itemToUpdate._id,
          type: 1,
          status: "Pending",
        },
        {
          $set: {
            type: 2,
            status: "Pending",
          },
        },
        { new: true }
      );

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: findOrder._id, "items._id": itemToUpdate._id },
        {
          $set: {
            "items.$.status": "Delivered",
          },
        },
        { new: true }
      );

      //notification related
      if (!user.isBlock) {
        const payload = {
          to: user.fcmToken,
          notification: {
            title: `your Order item status has been updated to Delivered!`,
          },
        };

        const notification = new Notification();

        notification.userId = findOrder.userId;
        notification.image = user.image;
        notification.sellerId = itemToUpdate.sellerId;
        notification.productId = itemToUpdate.productId;
        notification.message = payload.notification.title;
        notification.notificationType = 2;
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await notification.save();

        await fcm.send(payload, async (error, response) => {
          if (error) {
            console.log("Something has gone wrong: ", error);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }

      const data = await Order.findOne({ _id: updatedOrder._id })
        .populate({
          path: "items.productId",
          select: "productName mainImage _id",
        })
        .populate({
          path: "items.sellerId",
          select: "firstName lastName businessName",
        })
        .populate({
          path: "userId",
          select: "firstName lastName uniqueId",
        });

      return res.status(200).json({
        status: true,
        message: "finally, Order item status has been updated to Delivered",
        data: data,
      });
    } else if (req.query.status === "Cancelled") {
      if (itemToUpdate.status === "Out Of Delivery")
        return res.status(200).json({
          status: false,
          message: "This order is already Out Of Delivery, after completion you can't update it to Cancelled",
        });

      if (itemToUpdate.status === "Delivered")
        return res.status(200).json({
          status: false,
          message: "This order is already Delivered , you can't update it to Cancelled",
        });

      if (itemToUpdate.status === "Cancelled")
        return res.status(200).json({
          status: false,
          message: "You can't cancel this order, This order is already cancelled",
        });

      //update existing wallet When order cancelled with type 4 and status "Cancelled"
      await SellerWallet.findOneAndUpdate(
        {
          orderId: findOrder._id,
          itemId: itemToUpdate._id,
          type: 1,
          status: "Pending",
        },
        {
          $set: {
            type: 4,
            status: "Cancelled",
          },
        },
        { new: true }
      );

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: findOrder._id, "items._id": itemToUpdate._id },
        {
          $set: {
            "items.$.status": "Cancelled",
          },
        },
        { new: true }
      );

      //notification related
      if (!user.isBlock) {
        const payload = {
          to: user.fcmToken,
          notification: {
            title: `your Order item status has been updated to Cancelled!`,
          },
        };

        const notification = new Notification();

        notification.userId = findOrder.userId;
        notification.image = user.image;
        notification.sellerId = itemToUpdate.sellerId;
        notification.productId = itemToUpdate.productId;
        notification.message = payload.notification.title;
        notification.notificationType = 2;
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        await notification.save();

        await fcm.send(payload, async (error, response) => {
          if (error) {
            console.log("Something has gone wrong: ", error);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }

      const data = await Order.findOne({ _id: updatedOrder._id })
        .populate({
          path: "items.productId",
          select: "productName mainImage _id",
        })
        .populate({
          path: "items.sellerId",
          select: "firstName lastName businessName",
        })
        .populate({
          path: "userId",
          select: "firstName lastName uniqueId",
        });

      return res.status(200).json({
        status: true,
        message: "finally, Order item status has been updated to Cancelled",
        data: data,
      });
    } else {
      return res.status(200).json({ status: false, message: "status must be passed valid" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//cancel the order by user
exports.cancelOrderByUser = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.orderId || !req.query.status || !req.query.itemId) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const [user, findOrder] = await Promise.all([
      User.findById(req.query.userId),
      Order.findById(req.query.orderId)
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    if (user.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by the admin." });
    }

    if (!findOrder)
      return res.status(200).json({
        status: false,
        message: "Order does not found!",
      });

    if (findOrder.userId.toString() !== user._id.toString())
      return res.status(200).json({
        status: false,
        message: "This order does not belongs to your account!",
      });

    const itemToUpdate = findOrder.items.find((item) => item._id.toString() === req.query.itemId.toString());
    if (!itemToUpdate) {
      return res.status(200).json({ status: false, message: "Item does not found in the order!" })
    }
    //console.log("itemToUpdate in cancel order by the user: ", itemToUpdate);

    if (req.query.status === "Cancelled") {
      if (itemToUpdate.status === "Out Of Delivery")
        return res.status(200).json({
          status: false,
          message: "This order is already Out Of Delivery, after completion you can't update it to Cancelled",
        });

      if (itemToUpdate.status === "Delivered")
        return res.status(200).json({
          status: false,
          message: "This order is already Delivered , you can't update it to Cancelled",
        });

      if (itemToUpdate.status === "Cancelled")
        return res.status(200).json({
          status: false,
          message: "You can't cancel this order, This order is already cancelled",
        });

      //update existing wallet When order cancelled with type 4 and status "Cancelled" and update orser's items status "Cancelled"
      const [walletUpdate, updatedOrder] = await Promise.all([
        SellerWallet.findOneAndUpdate(
          {
            orderId: findOrder._id,
            itemId: itemToUpdate._id,
            type: 1,
            status: "Pending",
          },
          {
            $set: {
              type: 4,
              status: "Cancelled",
            },
          },
          { new: true }
        ),

        Order.findOneAndUpdate(
          { _id: findOrder._id, "items._id": itemToUpdate._id },
          {
            $set: {
              "items.$.status": "Cancelled",
            },
          },
          { new: true }
        ),
      ]);

      //notification related
      if (!user.isBlock) {
        const payload = {
          to: user.fcmToken,
          notification: {
            title: `your Order item status has been updated to Cancelled.`,
          },
        };

        const notification = new Notification();

        notification.userId = findOrder.userId;
        notification.image = user.image;
        notification.sellerId = itemToUpdate.sellerId;
        notification.message = payload.notification.title;
        notification.notificationType = 2;
        notification.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        await notification.save();

        await fcm.send(payload, async (error, response) => {
          if (error) {
            console.log("Something has gone wrong: ", error);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }

      const data = await Order.findOne({ _id: updatedOrder._id })
        .populate({
          path: "items.productId",
          select: "productName mainImage _id",
        })
        .populate({
          path: "items.sellerId",
          select: "firstName lastName businessName",
        });

      return res.status(200).json({
        status: true,
        message: "finally, Order item status has been updated to Cancelled",
        data: data,
      });
    } else {
      return res.status(200).json({ status: false, message: "status must be passed be valid" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//get order counts for seller
exports.orderCountForSeller = async (req, res) => {
  try {
    if (!req.query.sellerId || !req.query.startDate || !req.query.endDate) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!!" });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!!" });
    }

    let dateQuery = {};
    const start_date = new Date(req.query.startDate);
    const end_date = new Date(req.query.endDate);

    dateQuery = {
      analyticDate: {
        $gte: start_date,
        $lte: end_date,
      },
    };
    //console.log("dateQuery____", dateQuery);

    const order = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $addFields: {
          "items.analyticDate": {
            $toDate: {
              $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
            },
          },
        },
      },
      {
        $match: {
          "items.sellerId": seller._id,
          "items.analyticDate": {
            $gte: start_date,
            $lte: end_date,
          },
        },
      },
    ]);

    const totalOrders = order.length;

    const pendingOrders = order.filter((item) => {
      return item.items.status === "Pending";
    }).length;

    const confirmedOrders = order.filter((item) => {
      return item.items.status === "Confirmed";
    }).length;

    const outOfDeliveryOrders = order.filter((item) => {
      return item.items.status === "Out Of Delivery";
    }).length;

    const deliveredOrders = order.filter((item) => {
      return item.items.status === "Delivered";
    }).length;

    const cancelledOrders = order.filter((item) => {
      return item.items.status === "Cancelled";
    }).length;

    return res.status(200).json({
      status: true,
      message: "get Order count for the seller",
      totalOrders,
      pendingOrders,
      confirmedOrders,
      outOfDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

//get status wise order details for seller
exports.orderDetailsForSeller = async (req, res) => {
  try {
    if (!req.query.sellerId || !req.query.status || !req.query.startDate || !req.query.endDate) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!" });
    }

    const start_date = new Date(req.query.startDate);
    const end_date = new Date(req.query.endDate);

    if (req.query.status === "Pending") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $addFields: {
            "items.analyticDate": {
              $toDate: {
                $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
              },
            },
          },
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Pending",
            "items.analyticDate": {
              $gte: start_date,
              $lte: end_date,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            createdAt: { $first: "$createdAt" },
            trackingLink: { $first: "$trackingLink" },
            paymentGateway: { $first: "$paymentGateway" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            userMobileNumber: { $first: "$user.mobileNumber" },
            userId: { $first: "$user._id" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
            userMobileNumber: 1,
            userId: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Confirmed") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $addFields: {
            "items.analyticDate": {
              $toDate: {
                $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
              },
            },
          },
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Confirmed",
            "items.analyticDate": {
              $gte: start_date,
              $lte: end_date,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            createdAt: { $first: "$createdAt" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
            userMobileNumber: { $first: "$user.mobileNumber" },
            userId: { $first: "$user._id" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
            userMobileNumber: 1,
            userId: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Out Of Delivery") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $addFields: {
            "items.analyticDate": {
              $toDate: {
                $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
              },
            },
          },
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Out Of Delivery",
            "items.analyticDate": {
              $gte: start_date,
              $lte: end_date,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            paymentGateway: { $first: "$paymentGateway" },
            createdAt: { $first: "$createdAt" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            userMobileNumber: { $first: "$user.mobileNumber" },
            userId: { $first: "$user._id" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
            userMobileNumber: 1,
            userId: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Delivered") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $addFields: {
            "items.analyticDate": {
              $toDate: {
                $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
              },
            },
          },
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Delivered",
            "items.analyticDate": {
              $gte: start_date,
              $lte: end_date,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            paymentGateway: { $first: "$paymentGateway" },
            createdAt: { $first: "$createdAt" },
            userId: { $first: "$user._id" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            userMobileNumber: { $first: "$user.mobileNumber" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
            userMobileNumber: 1,
            userId: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Cancelled") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $addFields: {
            "items.analyticDate": {
              $toDate: {
                $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
              },
            },
          },
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Cancelled",
            "items.analyticDate": {
              $gte: start_date,
              $lte: end_date,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            createdAt: { $first: "$createdAt" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
            userMobileNumber: { $first: "$user.mobileNumber" },
            userId: { $first: "$user._id" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
            userMobileNumber: 1,
            userId: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "All") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $addFields: {
            "items.analyticDate": {
              $toDate: {
                $arrayElemAt: [{ $split: ["$items.date", ","] }, 0],
              },
            },
          },
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": {
              $in: ["Pending", "Confirmed", "Out Of Delivery", "Delivered", "Cancelled"],
            },
            "items.analyticDate": {
              $gte: start_date,
              $lte: end_date,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            createdAt: { $first: "$createdAt" },
            paymentGateway: { $first: "$paymentGateway" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            userMobileNumber: { $first: "$user.mobileNumber" },
            userId: { $first: "$user._id" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
            userMobileNumber: 1,
            userId: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else {
      return res.status(500).json({ status: false, message: "status must be passed valid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//get particular user's status wise orders for admin (user)
exports.ordersOfUser = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.status || !req.query.start || !req.query.limit) {
      return res.status(200).json({ status: true, message: "Oops ! Invalid details." });
    }

    const [user, order] = await Promise.all([
      User.findById(req.query.userId),
      Order.findOne({ userId: req.query.userId })
    ]);

    if (!user) {
      return res.status(200).json({ status: true, message: "User does not found!" });
    }

    if (user.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by the admin." });
    }

    if (!order) {
      return res.status(200).json({
        status: false,
        message: "This order does not belongs to your account!!",
      });
    }

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let statusQuery = {};
    if (req.query.status === "Pending") {
      statusQuery = { "items.status": "Pending" };
    } else if (req.query.status === "Confirmed") {
      statusQuery = { "items.status": "Confirmed" };
    } else if (req.query.status === "Out Of Delivery") {
      statusQuery = { "items.status": "Out Of Delivery" };
    } else if (req.query.status === "Delivered") {
      statusQuery = { "items.status": "Delivered" };
    } else if (req.query.status === "Cancelled") {
      statusQuery = { "items.status": "Cancelled" };
    } else if (req.query.status === "All") {
      statusQuery = {
        "items.status": {
          $in: ["Pending", "Confirmed", "Out Of Delivery", "Delivered", "Cancelled"],
        },
      };
    } else {
      return res.status(200).json({ status: false, message: "status must be passed valid" });
    }

    const [totalOrder, orderData] = await Promise.all([
      Order.countDocuments({ userId: user._id, ...statusQuery }),
      Order.find({ userId: user._id, ...statusQuery })
        .populate({
          path: "items.productId",
          select: {
            productName: 1,
            mainImage: 1,
            _id: 1,
          },
        })
        .skip((start - 1) * limit)
        .limit(limit)
    ]);

    if (req.query.status !== "All") {
      orderData.forEach((order) => {
        order.items = order?.items.filter((item) => item?.status === req?.query?.status);
      });
    }

    return res.status(200).json({
      status: true,
      messages: `get OrderHistory for User with status ${req.query.status}`,
      totalOrder: totalOrder,
      orderData: orderData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//get particular seller's status wise orders for admin (Seller)
exports.ordersOfSeller = async (req, res) => {
  try {
    if (!req.query.sellerId || !req.query.status || !req.query.start || !req.query.limit) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details." });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found." });
    }

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (req.query.status === "Pending") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Pending",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
          },
        },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Confirmed") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Confirmed",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
          },
        },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Out Of Delivery") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Out Of Delivery",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
          },
        },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Delivered") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Delivered",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
          },
        },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "Cancelled") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": "Cancelled",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
          },
        },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else if (req.query.status === "All") {
      const order = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $match: {
            "items.sellerId": seller._id,
            "items.status": {
              $in: ["Pending", "Confirmed", "Out Of Delivery", "Delivered", "Cancelled"],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            items: { $push: "$items" },
            shippingAddress: { $first: "$shippingAddress" },
            orderId: { $first: "$orderId" },
            userFirstName: { $first: "$user.firstName" },
            userLastName: { $first: "$user.lastName" },
            paymentGateway: { $first: "$paymentGateway" },
          },
        },
        {
          $project: {
            _id: 1,
            items: 1,
            shippingAddress: 1,
            orderId: 1,
            paymentGateway: 1,
            userFirstName: 1,
            userLastName: 1,
          },
        },
        { $skip: (start - 1) * limit },
        { $limit: limit },
      ]);

      const orderWithProducts = await Order.populate(order, {
        path: "items.productId",
        select: "productName mainImage _id",
      });

      return res.status(200).json({
        status: true,
        message: `Order history for seller with status ${req.query.status}`,
        orders: orderWithProducts,
      });
    } else {
      return res.status(500).json({ status: false, message: "status must be passed valid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

//status wise get all orders for admin
//exports.getOrders = async (req, res) => {
//   try {
//     const start = req.query.start ? parseInt(req.query.start) : 1;
//     const limit = req.query.limit ? parseInt(req.query.limit) : 10;

//     const data = await Order.aggregate([
//       {
//         $sort: { createdAt: 1 },
//       },
//       {
//         $lookup: {
//           from: "users",
//           let: {
//             userId: "$userId",
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$$userId", "$_id"] },
//               },
//             },
//             {
//               $project: {
//                 firstName: 1,
//                 lastName: 1,
//                 image: 1,
//                 uniqueId: 1,
//                 _id: 1,
//               },
//             },
//           ],
//           as: "userId",
//         },
//       },
//       {
//         $unwind: {
//           path: "$userId",
//           preserveNullAndEmptyArrays: false,
//         },
//       },
//       {
//         $lookup: {
//           from: "products",
//           let: {
//             productIds: "$items.productId",
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $in: ["$_id", "$$productIds"] },
//               },
//             },
//             {
//               $project: {
//                 productName: 1,
//                 price: 1,
//                 mainImage: 1,
//               },
//             },
//           ],
//           as: "productData",
//         },
//       },
//       {
//         $addFields: {
//           items: {
//             $map: {
//               input: "$items",
//               as: "item",
//               in: {
//                 $mergeObjects: [
//                   "$$item",
//                   {
//                     $arrayElemAt: [
//                       {
//                         $filter: {
//                           input: "$productData",
//                           cond: { $eq: ["$$this._id", "$$item.productId"] },
//                         },
//                       },
//                       0,
//                     ],
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $unset: "productData",
//       },
//       {
//         $lookup: {
//           from: "sellers",
//           let: {
//             sellerIds: "$items.sellerId",
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $in: ["$_id", "$$sellerIds"] },
//               },
//             },
//             {
//               $project: {
//                 businessName: 1,
//               },
//             },
//           ],
//           as: "sellerData",
//         },
//       },
//       {
//         $addFields: {
//           items: {
//             $map: {
//               input: "$items",
//               as: "item",
//               in: {
//                 $mergeObjects: [
//                   "$$item",
//                   {
//                     $arrayElemAt: [
//                       {
//                         $filter: {
//                           input: "$sellerData",
//                           cond: { $eq: ["$$this._id", "$$item.sellerId"] },
//                         },
//                       },
//                       0,
//                     ],
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $unset: "sellerData",
//       },
//       {
//         $group: {
//           _id: "$userId",
//           count: { $sum: 1 },
//           orders: { $push: "$$ROOT" },
//         },
//       },
//       // {
//       //   $project: {
//       //     _id: 0, //exclude the _id field from the final result
//       //     count: 1,
//       //     orders: 1,
//       //   },
//       // },
//       {
//         $project: {
//           _id: 0,
//           count: 1,
//           orders: {
//             $map: {
//               input: "$orders",
//               as: "order",
//               in: {
//                 $mergeObjects: [
//                   "$$order",
//                   {
//                     items: {
//                       $map: {
//                         input: "$$order.items",
//                         as: "item",
//                         in: {
//                           $arrayToObject: {
//                             $filter: {
//                               input: { $objectToArray: "$$item" },
//                               cond: { $ne: ["$$this.k", "_id"] }, //exclude the _id field of items array
//                             },
//                           },
//                         },
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $facet: {
//           orders: [{ $skip: (start - 1) * limit }, { $limit: limit }],
//         },
//       },
//     ]);

//     return res.status(200).json({
//       status: true,
//       message: "get all orders Successfully!!",
//       totalOrders: data[0].orders,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       error: error.message || "Internal Server Error!!",
//     });
//   }
//};

exports.getOrders = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let statusQuery = {};
    if (req.query.status === "Pending") {
      statusQuery = { "items.status": "Pending" };
    } else if (req.query.status === "Confirmed") {
      statusQuery = { "items.status": "Confirmed" };
    } else if (req.query.status === "Out Of Delivery") {
      statusQuery = { "items.status": "Out Of Delivery" };
    } else if (req.query.status === "Delivered") {
      statusQuery = { "items.status": "Delivered" };
    } else if (req.query.status === "Cancelled") {
      statusQuery = { "items.status": "Cancelled" };
    } else if (req.query.status === "All") {
      statusQuery = {
        "items.status": {
          $in: ["Pending", "Confirmed", "Out Of Delivery", "Delivered", "Cancelled"],
        },
      };
    } else {
      return res.status(500).json({ status: false, message: "status must be passed valid" });
    }

    const [totalOrders, orders] = await Promise.all([
      Order.countDocuments(statusQuery),

      Order.find(statusQuery)
        .populate({
          path: "items.productId",
          select: {
            productName: 1,
            mainImage: 1,
            _id: 1,
          },
        })
        .populate({
          path: "items.sellerId",
          select: "businessName",
        })
        .populate({
          path: "userId",
          select: "firstName lastName uniqueId",
        })
        .sort({ createdAt: -1 })
        .skip((start - 1) * limit)
        .limit(limit),
    ]);

    if (req.query.status !== "All") {
      orders.forEach((order) => {
        order.items = order?.items.filter((item) => item?.status === req?.query?.status);
      });
    }

    return res.status(200).json({
      status: true,
      message: "finally, get the all orders Successfully!",
      totalOrders,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//get particular order Wise order details (admin)
exports.orderDetails = async (req, res) => {
  try {
    if (!req.query.orderId) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details." });
    }

    const order = await Order.findById(req.query.orderId);
    if (!order) {
      return res.status(200).json({ status: false, message: "Order does not found." });
    }

    const orderWithProducts = await Order.findOne({ _id: order._id })
      .populate({
        path: "items.productId",
        select: "productName mainImage _id",
      })
      .populate({
        path: "items.sellerId",
        select: "firstName lastName",
      });

    return res.status(200).json({
      status: true,
      message: "get order details for admin.",
      order: orderWithProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

//get recent orders for admin (dashboard)
exports.recentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ date: -1 })
      .limit(10)
      .populate("userId", "firstName lastName")
      .populate("items.productId", "productName mainImage _id")
      .exec();

    return res.status(200).json({
      status: true,
      message: "finally, get all recent orders!!",
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//get status wise order details for user
exports.orderDetailsForUser = async (req, res) => {
  try {
    if (!req.query.userId || !req.query.status) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!" });
    }

    if (user.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by the admin." });
    }

    // const order = await Order.findOne({ userId: user._id });
    // if (!order)
    //   return res.status(200).json({
    //     status: false,
    //     message: "order does not found for that user.",
    //   });

    let statusQuery = {};
    if (req.query.status === "Pending") {
      statusQuery = { "items.status": "Pending" };
    } else if (req.query.status === "Confirmed") {
      statusQuery = { "items.status": "Confirmed" };
    } else if (req.query.status === "Out Of Delivery") {
      statusQuery = { "items.status": "Out Of Delivery" };
    } else if (req.query.status === "Delivered") {
      statusQuery = { "items.status": "Delivered" };
    } else if (req.query.status === "Cancelled") {
      statusQuery = { "items.status": "Cancelled" };
    } else if (req.query.status === "All") {
      statusQuery = {
        "items.status": {
          $in: ["Pending", "Confirmed", "Out Of Delivery", "Delivered", "Cancelled"],
        },
      };
    } else {
      return res.status(200).json({ status: false, message: "status must be passed valid" });
    }

    const orderData = await Order.find({ userId: user._id, ...statusQuery })
      .populate("items.productId", "productName mainImage _id")
      .populate("userId", "firstName lastName mobileNumber")
      .sort({ createdAt: -1 });

    if (orderData.length === 0) {
      return res.status(200).json({
        status: false,
        message: `Order does not found for that user with status ${req.query.status}.`,
        totalOrders: 0,
        orderData: [],
      });
    }

    if (req.query.status !== "All") {
      orderData.forEach((order) => {
        order.items = order?.items.filter((item) => item?.status === req?.query?.status);
      });
    }

    return res.status(200).json({
      status: true,
      messages: `get OrderHistory for User with status ${req.query.status}`,
      totalOrders: orderData.length > 0 ? orderData.length : 0,
      orderData: orderData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
