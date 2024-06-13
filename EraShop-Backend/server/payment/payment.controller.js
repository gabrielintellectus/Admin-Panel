const Payment = require("./payment.model");
const Order = require("../order/order.model");
const User = require("../user/user.model");

const Email = require("./email.service")


//create payment by the user
exports.createPayment = async (req, res) => {
  try {
    if (!req.body.orderId || !req.body.userId ||!req.body.paymentGateway ||!req.body.paymentGatewayId || !req.body.gatewayReturn) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const [order, user] = await Promise.all([
        Order.findOne({ _id: req.body.orderId }),
        User.findOne({ _id: req.body.userId })
      ]);

    if (order && user) {
        const newPayment = new Payment();

        newPayment.userId = user._id;
        newPayment.orderId = order._id;
        newPayment.paymentGateway = req.body.paymentGateway;
        newPayment.paymentGatewayId = req.body.paymentGatewayId ;
        newPayment.gatewayReturn = req.body.gatewayReturn;
  
        await newPayment.save();

        return res.status(200).json({ 
            status: true, 
            message: "Payment has been created by user.", 
            payment: newPayment 
        });

    } else if (!order) {
        return res.status(404).json({ status: false, message: "Order not found"});
    } else if (!user) {
        return res.status(404).json({ status: false, message: "User not found"});
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};

//webhook for Stripe updates
exports.stripeWebHook = async (req, res) => {
    const event = req.body;
    const payment = await Payment.findOne({ paymentGatewayId: event?.data?.payment_intent });
    const order = await Order.findById(payment?.orderId);

    if(!order) {
      return res.status(201).json({
        received: true
      });
    } else if (event?.data?.object?.paid === true && event?.data?.object?.amount === order.finalTotal) {

      // Handle the event
      switch (event.type) {
        case 'checkout.session.async_payment_failed':
          const checkoutSessionAsyncPaymentFailed = event.data.object;
          // Then define and call a function to handle the event checkout.session.async_payment_failed
          order.items.forEach(item => {
            item.status = 'Cancelled';
          });
          await order.save();
          break;
        case 'checkout.session.async_payment_succeeded':
          const checkoutSessionAsyncPaymentSucceeded = event.data.object;
          // Then define and call a function to handle the event checkout.session.async_payment_succeeded
          order.items.forEach(item => {
            item.status = 'Confirmed';
          });
          await order.save();

          break;
        case 'checkout.session.completed':
          const checkoutSessionCompleted = event.data.object;
          // Then define and call a function to handle the event checkout.session.completed
          break;
        case 'checkout.session.expired':
          const checkoutSessionExpired = event.data.object;
          // Then define and call a function to handle the event checkout.session.expired
          order.items.forEach(item => {
            item.status = 'Cancelled';
          });
          await order.save();
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      const userEmail = await User.findById(order?.userId);

      await Email.send(userEmail.email, userEmail.firstName, order._id)

      return res.status(200).json({
        received: true
      });
    }
  
    // Return a response to acknowledge receipt of the event
    res.status(200).json({
      received: true
    });
  }
