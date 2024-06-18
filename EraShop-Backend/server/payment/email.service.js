const Order = require("../order/order.model");

//nodemailer
const nodemailer = require("nodemailer");

//Config
const config = require("../../config");

exports.send = async (email, userName, orderId) => {
    try {
      const order = await Order.findById(orderId);
  
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        user: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: `${config.EMAIL}`,
          pass: `${config.PASSWORD}`,
        },
      });

      var tab = ``;
      tab += `<!DOCTYPE html><html lang="en"><head>`;
      tab += `<meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">`;
      tab += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
      tab += `</head><body><div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">`;
      tab += `<div style="margin:50px auto;width:70%;padding:20px 0"><div style="border-bottom:1px solid #eee">`;
      tab += `<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hi, ${userName}</a>`;
      tab += `</div>`;
      tab += `<div>`;
      
      tab += `<h3>Order Details</h3>`;
      tab += `<table style="width:100%;border-collapse:collapse;">`;
      tab += `<tr><td>Order ID:</td><td>${order.orderId}</td></tr>`;
      tab += `<tr><td>Total Quantity:</td><td>${order.totalQuantity}</td></tr>`;
      tab += `<tr><td>Total Items:</td><td>${order.totalItems}</td></tr>`;
      tab += `<tr><td>Total Shipping Charges:</td><td>R$ ${order.totalShippingCharges}</td></tr>`;
      tab += `<tr><td>SubTotal:</td><td>R$ ${order.subTotal}</td></tr>`;
      tab += `<tr><td>Total:</td><td>R$ ${order.total}</td></tr>`;
      tab += `<tr><td>Final Total:</td><td>R$ ${order.finalTotal}</td></tr>`;
      tab += `</table>`;
      tab += `<hr style="border:none;border-top:1px solid #eee" />`
      
      tab += `<h3>Items:</h3>`;
      tab += `<table style="width:100%;border-collapse:collapse;">`;
      order.items.forEach(item => {
        tab += `<tr><td>Product ID:</td><td>${item.productId}</td></tr>`;
        tab += `<tr><td>Product Code:</td><td>${item.productCode}</td></tr>`;
        tab += `<tr><td>Product Quantity:</td><td>${item.productQuantity}</td></tr>`;
        tab += `<tr><td>Purchased Time Product Price:</td><td>R$ ${item.purchasedTimeProductPrice}</td></tr>`;
        tab += `<tr><td>Purchased Time Shipping Charges:</td><td>${item.purchasedTimeShippingCharges}</td></tr>`;
        tab += `<tr><td>Status:</td><td style="${item.status === "Confirmed"? "color: green" : "color: red"}">${item.status}</td></tr>`;
        tab += `<tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee" /></td></tr>`;
      });
      tab += `</table>`;
      
      tab += `</div>`;
      tab += `<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">`;
      tab += `</div></div></div></body></html>`;
      
      //mail details
      var mailOptions = {
        from: `${config.EMAIL}`,
        to: email,
        subject: `LivePay Order Details`,
        html: tab,
      };
  
      transporter.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.error(error)
          return false
        } else {
          return true
        }
      });
    } catch (error) {
      console.error(error)
      return false
    }
  };