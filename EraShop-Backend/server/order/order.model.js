const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, default: null }, //unique orderId
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        sellerId: { ref: "Seller", type: mongoose.Schema.Types.ObjectId },

        purchasedTimeProductPrice: { type: Number, default: 0 },
        purchasedTimeShippingCharges: { type: Number, default: 0 },
        productCode: { type: String },
        productQuantity: { type: Number, default: 0 },
        attributesArray: [
          {
            name: { type: String },
            value: { type: String },
          },
        ],

        commissionPerProductQuantity: { type: Number, default: 0 },

        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Out Of Delivery", "Delivered", "Cancelled"],
        },
        date: { type: String },

        deliveredServiceName: { type: String, default: null },
        trackingId: { type: String, default: null },
        trackingLink: { type: String, default: null },
      },
    ],

    purchasedTimeadminCommissionCharges: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 }, //Holds total number of items in the cart

    totalShippingCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    subTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 }, //after addition of totalShippingCharges
    finalTotal: { type: Number, default: 0 }, //after deduction of discount according to promoCode

    shippingAddress: {
      name: { type: String, default: null },
      country: { type: String, default: null },
      state: { type: String, default: null },
      city: { type: String, default: null },
      zipCode: { type: Number, default: null },
      address: { type: String, default: null },
    },

    promoCode: {
      promoCode: { type: String, default: null },
      discountType: { type: Number, default: null }, //0.flat 1.percentage
      discountAmount: { type: Number, default: null }, //amount or percentage
      conditions: { type: Array, default: [] },
    },

    paymentGateway: { type: String, default: "Master Card" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.index({ "items.productId": 1, "items.sellerId": 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
