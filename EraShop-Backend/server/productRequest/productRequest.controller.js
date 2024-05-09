const ProductRequest = require("./productRequest.model");

//fs
const fs = require("fs");

//config
const Config = require("../../config");

//import model
const Seller = require("../seller/seller.model");
const Category = require("../category/category.model");
const SubCategory = require("../subCategory/subCategory.model");
const Setting = require("../setting/setting.model");
const Product = require("../product/product.model");

//deletefile
const { deleteFile } = require("../../util/deleteFile");

//deleteFiles
const { deleteFiles } = require("../../util/deleteFile");

//create product update request by seller to admin or directly product update by seller
exports.updateProductRequest = async (req, res) => {
  try {
    if (!req.query.productId || !req.query.sellerId || !req.query.productCode) {
      if (req.files) deleteFiles(req.files);
      return res.status(200).json({
        status: true,
        message: "Oops ! Invalid details.",
      });
    }

    const [seller, product, setting] = await Promise.all([
      Seller.findById(req.query.sellerId),
      Product.findOne({
        _id: req.query.productId,
        productCode: req.query.productCode,
        seller: req.query.sellerId,
        createStatus: "Approved",
      }),
      Setting.findOne({ isUpdateProductRequest: true }),
    ]);

    if (!seller) {
      if (req.files) deleteFiles(req.files);
      return res.status(200).json({ status: false, message: "seller does not found." });
    }

    if (!product) {
      if (req.files) deleteFiles(req.files);
      return res.status(200).json({ status: false, message: "No product Was Found." });
    }

    if (!setting) {
      if (req.files) deleteFiles(req.files);
      return res.status(200).json({ status: false, message: "No setting Was Found." });
    }

    if (setting) {
      if (product.updateStatus === "Approved") {
        product.updateStatus = "Pending";
        await product.save();
      }

      if (req?.body?.category) {
        var category = await Category.findById(req.body.category);
        if (!category) {
          if (req.files) deleteFiles(req.files);
          return res.status(200).json({ status: false, message: "category does not found." });
        }
      }

      if (req?.body?.subCategory) {
        var subCategory = await SubCategory.findById(req.body.subCategory);
        if (!subCategory) {
          if (req.files) deleteFiles(req.files);
          return res.status(200).json({ status: false, message: "subCategory does not found." });
        }
      }

      const updateProductrequest = new ProductRequest();

      updateProductrequest.productName = req.body.productName ? req.body.productName : product.productName;
      updateProductrequest.description = req.body.description ? req.body.description : product.description;
      updateProductrequest.price = req.body.price ? req.body.price : product.price;
      updateProductrequest.shippingCharges = req.body.shippingCharges ? req.body.shippingCharges : product.shippingCharges;
      updateProductrequest.category = req.body.category ? category._id : product.category;
      updateProductrequest.subCategory = req.body.subCategory ? subCategory._id : product.subCategory;
      updateProductrequest.seller = product.seller;
      updateProductrequest.productCode = product.productCode;
      updateProductrequest.updateStatus = "Pending";
      updateProductrequest.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

      if (req.files.mainImage) {
        const image = product?.mainImage.split("storage");
        if (image) {
          if (fs.existsSync("storage" + image[1])) {
            fs.unlinkSync("storage" + image[1]);
          }
        }

        updateProductrequest.mainImage = Config.baseURL + req.files.mainImage[0].path;
      } else {
        updateProductrequest.mainImage = product.mainImage;
      }

      if (req.files.images) {
        var imagesData = [];

        if (product.images.length > 0) {
          for (var i = 0; i < product.images.length; i++) {
            const images = product.images[i].split("storage");

            if (images) {
              if (fs.existsSync("storage" + images[1])) {
                fs.unlinkSync("storage" + images[1]);
              }
            }
          }
        }

        await req.files.images.map((data) => {
          imagesData.push(Config.baseURL + data.path);
        });

        updateProductrequest.images = imagesData;
      } else {
        updateProductrequest.images = product.images;
      }

      if (req.body.attributes) {
        let attributes;

        if (typeof req.body.attributes === "string") {
          console.log("attributes in body: ", typeof req.body.attributes);

          attributes = JSON.parse(req.body.attributes);
        } else if (typeof req.body.attributes === "object") {
          console.log("attributes in body: ", typeof req.body.attributes);

          attributes = req.body.attributes;
        } else {
          return res.status(200).json({
            status: false,
            message: "Invalid attributes format",
          });
        }

        if (Array.isArray(attributes)) {
          const updatedAttributes = attributes.map((attr) => {
            if (attr && attr._id) {
              const existingAttribute = product.attributes.find(
                (attribute) => attribute && attribute._id && attribute._id.toString() === attr._id.toString()
              );

              if (existingAttribute) {
                const updatedAttribute = {
                  ...existingAttribute,
                  name: attr.name || existingAttribute.name,
                  value: attr.value || existingAttribute.value,
                };

                return updatedAttribute;
              }
            }

            return attr;
          });

          updateProductrequest.attributes = updatedAttributes;
        } else {
          console.log("req.body.attributes is not an array.");
        }
      } else {
        updateProductrequest.attributes = product.attributes;
      }

      await updateProductrequest.save();

      const updateProductrequest_ = await ProductRequest.findById(updateProductrequest._id).populate([
        {
          path: "seller",
          select: "firstName lastName businessTag businessName image",
        },
        { path: "category", select: "name" },
        { path: "subCategory", select: "name" },
      ]);

      return res.status(200).json({
        status: true,
        message: "finally, product request created by seller to admin for update the product!!",
        updateProductrequest: updateProductrequest_,
      });
    } else {
      if (req?.body?.category) {
        var category = await Category.findById(req.body.category);
        if (!category) {
          if (req.files) deleteFiles(req.files);
          return res.status(200).json({ status: false, message: "category does not found." });
        }
      }

      if (req?.body?.subCategory) {
        var subCategory = await SubCategory.findById(req.body.subCategory);
        if (!subCategory) {
          if (req.files) deleteFiles(req.files);
          return res.status(200).json({ status: false, message: "subCategory does not found." });
        }
      }

      product.productName = req.body.productName ? req.body.productName : product.productName;
      product.description = req.body.description ? req.body.description : product.description;
      product.price = req.body.price ? req.body.price : product.price;
      product.shippingCharges = req.body.shippingCharges ? req.body.shippingCharges : product.shippingCharges;
      product.category = req.body.category ? category._id : product.category;
      product.subCategory = req.body.subCategory ? subCategory._id : product.subCategory;
      product.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      product.updateStatus = "Approved";

      if (req.files.mainImage) {
        const image = product?.mainImage.split("storage");
        if (image) {
          if (fs.existsSync("storage" + image[1])) {
            fs.unlinkSync("storage" + image[1]);
          }
        }

        product.mainImage = Config.baseURL + req.files.mainImage[0].path;
      }

      if (req.files.images) {
        var imagesData = [];

        if (product.images.length > 0) {
          for (var i = 0; i < product.images.length; i++) {
            const images = product.images[i].split("storage");

            if (images) {
              if (fs.existsSync("storage" + images[1])) {
                fs.unlinkSync("storage" + images[1]);
              }
            }
          }
        }

        await req.files.images.map((data) => {
          imagesData.push(Config.baseURL + data.path);
        });

        product.images = imagesData;
      }

      if (req.body.attributes) {
        let attributes;

        if (typeof req.body.attributes === "string") {
          console.log("attributes in body: ", typeof req.body.attributes);

          attributes = JSON.parse(req.body.attributes);
        } else if (typeof req.body.attributes === "object") {
          console.log("attributes in body: ", typeof req.body.attributes);

          attributes = req.body.attributes;
        } else {
          return res.status(200).json({
            status: false,
            message: "Invalid attributes format",
          });
        }

        if (Array.isArray(attributes)) {
          const updatedAttributes = attributes.map((attr) => {
            if (attr && attr._id) {
              const existingAttribute = product.attributes.find(
                (attribute) => attribute && attribute._id && attribute._id.toString() === attr._id.toString()
              );

              if (existingAttribute) {
                const updatedAttribute = {
                  ...existingAttribute,
                  name: attr.name || existingAttribute.name,
                  value: attr.value || existingAttribute.value,
                };

                return updatedAttribute;
              }
            }

            return attr;
          });

          product.attributes = updatedAttributes;
        } else {
          console.log("req.body.attributes is not an array.");
        }
      }

      await product.save();

      const product_ = await Product.findById(product._id).populate([
        { path: "category", select: "name" },
        { path: "subCategory", select: "name" },
        {
          path: "seller",
          select: "firstName lastName businessTag businessName image",
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "isUpdateProductRequest is false by admin then directly product update by the seller",
        product: product_,
      });
    }
  } catch (error) {
    if (req.files) deleteFiles(req.files);
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//product request accept or decline to update product by admin
exports.acceptUpdateRequest = async (req, res) => {
  try {
    if (!req.query.requestId) {
      return res.status(200).json({ status: false, message: "requestId must be requried." });
    }

    const updateRequest = await ProductRequest.findOne({ _id: req.query.requestId, updateStatus: "Pending" });
    if (!updateRequest) {
      return res.status(200).json({ status: false, message: "product request to update the product does not found." });
    }

    if (updateRequest.updateStatus === "Approved") {
      return res.status(200).json({
        status: false,
        message: "product request already accepted by admin for update that product.",
      });
    }

    if (req.query.type === "Approved") {
      const product = await Product.findOne({
        productCode: updateRequest.productCode,
        createStatus: "Approved",
      });

      if (!product) {
        return res.status(200).json({ status: false, message: "No product Was Found." });
      }

      product.productName = updateRequest.productName;
      product.productCode = updateRequest.productCode;
      product.description = updateRequest.description;
      product.mainImage = updateRequest.mainImage;
      product.images = updateRequest.images;
      product.attributes = updateRequest.attributes;
      product.price = updateRequest.price;
      product.shippingCharges = updateRequest.shippingCharges;
      product.seller = updateRequest.seller;
      product.category = updateRequest.category;
      product.subCategory = updateRequest.subCategory;
      product.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      product.updateStatus = "Approved";
      await product.save();

      updateRequest.updateStatus = "Approved";
      await updateRequest.save();

      return res.status(200).json({
        status: true,
        message: "finally, product request accepted by the admin for update that product.",
        updateRequest,
      });
    } else if (req.query.type === "Rejected") {
      const product = await Product.findOne({
        productCode: updateRequest.productCode,
        createStatus: "Approved",
      });

      if (!product) {
        return res.status(200).json({ status: false, message: "No product Was Found." });
      }

      product.productName = updateRequest.productName;
      product.productCode = updateRequest.productCode;
      product.description = updateRequest.description;
      product.mainImage = updateRequest.mainImage;
      product.images = updateRequest.images;
      product.attributes = updateRequest.attributes;
      product.price = updateRequest.price;
      product.shippingCharges = updateRequest.shippingCharges;
      product.seller = updateRequest.seller;
      product.category = updateRequest.category;
      product.subCategory = updateRequest.subCategory;
      product.date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      product.updateStatus = "Rejected";
      await product.save();

      updateRequest.updateStatus = "Rejected";
      await updateRequest.save();

      return res.status(200).json({
        status: true,
        message: "product request rejected by admin for update that product.",
        updateRequest,
      });
    } else {
      return res.status(200).json({ status: false, message: "type must be passed valid." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error.!",
    });
  }
};

//get status wise all product requests to update product for admin
exports.updateProductRequestStatusWise = async (req, res) => {
  try {
    if (!req.query.status) {
      return res.status(200).json({ status: true, message: "status must be requried." });
    }

    let statusQuery = {};
    if (req.query.status === "Pending") {
      statusQuery = { updateStatus: "Pending" };
    } else if (req.query.status === "Approved") {
      statusQuery = { updateStatus: "Approved" };
    } else if (req.query.status === "Rejected") {
      statusQuery = { updateStatus: "Rejected" };
    } else if (req.query.status === "All") {
      statusQuery = {
        updateStatus: {
          $in: ["Pending", "Approved", "Rejected"],
        },
      };
    } else {
      return res.status(500).json({ status: false, message: "status must be passed valid" });
    }

    const productRequests = await ProductRequest.find(statusQuery);

    return res.status(200).json({
      status: true,
      message: `get all product's request to update the product with status ${req.query.status}`,
      productRequests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};
