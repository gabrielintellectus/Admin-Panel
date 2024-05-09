const Category = require("./category.model");

//import model
const SubCategory = require("../subCategory/subCategory.model");
const Product = require("../product/product.model");

//config
const config = require("../../config");

//fs
const fs = require("fs");

//deletefile
const { deleteFile } = require("../../util/deleteFile");

//create category
exports.store = async (req, res) => {
  try {
    if (!req.body.name.trim()) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const category = new Category();

    category.name = req.body.name.trim();
    category.image = config.baseURL + req?.file?.path;
    await category.save();

    return res.status(200).json({ status: true, message: "Category has been Created by the admin.", category: category });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server error",
    });
  }
};

//update category
exports.update = async (req, res) => {
  try {
    if (!req.query.categoryId) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "category Id is required!!" });
    }

    const category = await Category.findById(req.query.categoryId).populate("subCategory", "name image");
    if (!category) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "category does not found!" });
    }

    if (req?.file) {
      const image = category?.image.split("storage");
      if (image) {
        if (fs.existsSync("storage" + image[1])) {
          fs.unlinkSync("storage" + image[1]);
        }
      }

      category.image = config.baseURL + req?.file?.path;
    }

    category.name = req.body.name.trim() ? req.body.name.trim() : category.name.trim();
    await category.save();

    return res.status(200).json({ status: true, message: "category has been Updated by the admin.", category: category });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//delete category
exports.destroy = async (req, res) => {
  try {
    if (!req.query.categoryId) {
      return res.status(200).json({ status: false, message: "categoryId must be required!" });
    }

    const [category, subcategories] = await Promise.all([
      Category.findById(req.query.categoryId),
      SubCategory.find({ category: req.query.categoryId }),
    ]);

    if (!category) {
      return res.status(200).json({ status: false, message: "category does not found!" });
    }

    const image = category?.image.split("storage");
    if (image) {
      if (fs.existsSync("storage" + image[1])) {
        fs.unlinkSync("storage" + image[1]);
      }
    }

    //delete subcategories associated with the deleted category
    if (subcategories.length > 0) {
      await Promise.all(
        subcategories.map(async (subcategory) => {
          const subcategoryImage = subcategory?.image.split("storage");
          if (subcategoryImage) {
            if (fs.existsSync("storage" + subcategoryImage[1])) {
              fs.unlinkSync("storage" + subcategoryImage[1]);
            }
          }

          await SubCategory.findByIdAndDelete(subcategory._id);
        })
      );
    }

    await category.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "ctaegory and subcategories associated with the category deleted by admin." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//get all category with subCategory for seller
exports.get = async (req, res) => {
  try {
    const category = await Category.find().populate("subCategory", "name image").sort({ createdAt: -1 });

    if (category.length === 0) {
      return res.status(200).json({
        status: false,
        message: "Categories does not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "get all categories by the seller.",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server error" });
  }
};

//get all category for admin
exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    if (categories.length === 0) {
      return res.status(200).json({
        status: false,
        message: "Categories does not found.",
      });
    }

    const categoryPromises = categories?.map(async (category) => {
      const categoryId = category._id;

      const [categoryProductCount, totalSubcategoryCount] = await Promise.all([
        Product.countDocuments({ category: categoryId }),
        category.subCategory.length,
      ]);

      const modifiedCategory = {
        _id: category._id,
        name: category.name,
        image: category.image,
        categoryProduct: categoryProductCount,
        totalSubcategory: totalSubcategoryCount,
      };

      return modifiedCategory;
    });

    const modifiedCategories = await Promise.all(categoryPromises);

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved all Categories by the admin.",
      category: modifiedCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server error" });
  }
};
