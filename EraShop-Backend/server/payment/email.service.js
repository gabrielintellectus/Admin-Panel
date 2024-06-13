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
      tab += `<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hi, Mr./Ms. ${userName}</a>`;
      tab += `</div>`;
      tab += `<p style="font-size:1.1em">Hi,</p><p>Thank you for choosing LivePay.</p>`;
      tab += `<div style="padding:20px;">`;
    
      tab += `<h3>Order Details</h3>`;
      tab += `<p>Order ID: ${order.orderId}</p>`;
      tab += `<p>Total Quantity: ${order.totalQuantity}</p>`;
      tab += `<p>Total Items: ${order.totalItems}</p>`;
      tab += `<p>Total Shipping Charges: ${order.totalShippingCharges}</p>`;
      tab += `<p>SubTotal: ${order.subTotal}</p>`;
      tab += `<p>Total: ${order.total}</p>`;
      tab += `<p>Final Total: ${order.finalTotal}</p>`;
    
      tab += `<h3>Items:</h3>`;
      order.items.forEach(item => {
        tab += `<p>Product ID: ${item.productId}</p>`;
        tab += `<p>Product Code: ${item.productCode}</p>`;
        tab += `<p>Product Quantity: ${item.productQuantity}</p>`;
        tab += `<p>Purchased Time Product Price: ${item.purchasedTimeProductPrice}</p>`;
        tab += `<p>Purchased Time Shipping Charges: ${item.purchasedTimeShippingCharges}</p>`;
        tab += `<p style="color: green">Status: ${item.status}</p>`;
        tab += `<hr style="border:none;border-top:1px solid #eee" />`;
      });
    
      tab += `</div>`;
      tab += `<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">`;
      tab += `</div></div></div></body></html>`;
    
  
      //mail details
      var mailOptions = {
        from: `${config.EMAIL}`,
        to: email,
        subject: "Sending Email for Password Security",
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