const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String },
    productCode: { type: String, default: "EraShop#1234" },
    description: { type: String },
    date: { type: String },
    price: { type: Number, default: 0 },
    shippingCharges: { type: Number, default: 0 },

    mainImage: { type: String },
    images: { type: Array, default: [] },

    attributes: [
      {
        name: { type: String },
        value: [{ type: String }],
      },
    ],

    quantity: { type: Number, default: 0 },
    review: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    searchCount: { type: Number, default: 0 },

    isOutOfStock: { type: Boolean, default: false },
    isNewCollection: { type: Boolean, default: false },
    isSelect: { type: Boolean, default: false }, //when seller is live then seller took the selected products and go for live
    isAddByAdmin: { type: Boolean, default: false }, //fake product add by the admin
    isUpdateByAdmin: { type: Boolean, default: false },

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },

    //create product request status
    createStatus: {
      type: String,
      default: "All",
      enum: ["Pending", "Approved", "Rejected", "All"],
    },

    //update product request status
    updateStatus: {
      type: String,
      default: "All",
      enum: ["Pending", "Approved", "Rejected", "All"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ review: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ updatedAt: -1 });
productSchema.index({ searchCount: -1 });

module.exports = mongoose.model("Product", productSchema);
