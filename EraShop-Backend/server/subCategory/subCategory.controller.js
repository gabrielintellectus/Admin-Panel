const SubCategory = require("../subCategory/subCategory.model");
const Product = require("../../server/product/product.model");

//config
const config = require("../../config");

//fs
const fs = require("fs");

//deletefile
const { deleteFile } = require("../../util/deleteFile");

//import model
const Category = require("../category/category.model");

//create subCategory
exports.store = async (req, res) => {
  try {
    if (!req.body.name || !req.file || !req.body.category) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "category does not found!" });
    }

    const subCategory = new SubCategory();

    subCategory.name = req.body.name.trim();
    subCategory.image = config.baseURL + req?.file?.path;
    subCategory.category = category._id;

    category.subCategory.push(subCategory);

    await Promise.all([subCategory.save(), category.save()]);

    const [sameSubcategoryProductCount, subCategoryData] = await Promise.all([
      Product.countDocuments({ subCategory: subCategory._id }),
      SubCategory.findById(subCategory._id).populate("category", "name"),
    ]);

    return res.status(200).json({
      status: true,
      message: "SubCategory has been created by the admin.",
      sameSubcategoryProductCount: sameSubcategoryProductCount,
      subCategory: subCategoryData,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server error" });
  }
};

//update subCategory
exports.update = async (req, res) => {
  try {
    if (!req.query.subCategoryId) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "subCategoryId is required!" });
    }

    const subCategory = await SubCategory.findById(req.query.subCategoryId);
    if (!subCategory) {
      if (req.file) deleteFile(req.file);
      return res.status(200).json({ status: false, message: "subCategory does not found!" });
    }

    if (req?.file) {
      const subcategoryImage = subCategory?.image.split("storage");
      if (subcategoryImage) {
        if (fs.existsSync("storage" + subcategoryImage[1])) {
          fs.unlinkSync("storage" + subcategoryImage[1]);
        }
      }

      subCategory.image = config.baseURL + req?.file?.path;
    }

    subCategory.name = req?.body?.name ? req?.body?.name.trim() : subCategory.name;

    await subCategory.save();
    const subCategoryData = await SubCategory.findById(subCategory._id).populate("category", "name");

    return res.status(200).json({
      status: true,
      message: "SubCategory has been updated by the admin.",
      subCategory: subCategoryData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//delete subCategory
exports.destroy = async (req, res) => {
  try {
    if (!req.query.subCategoryId) {
      return res.status(200).json({ status: false, message: "subCategoryId is required!" });
    }

    const subCategory = await SubCategory.findById(req.query.subCategoryId);
    if (!subCategory) {
      return res.status(200).json({ status: false, message: "subCategory does not found!" });
    }

    const categoryId = subCategory?.category;

    const category = await Category.findById(categoryId);
    if (category) {
      category.subCategory.pull(subCategory._id);
      await category.save();
    }

    const subcategoryImage = subCategory?.image.split("storage");
    if (subcategoryImage) {
      if (fs.existsSync("storage" + subcategoryImage[1])) {
        fs.unlinkSync("storage" + subcategoryImage[1]);
      }
    }

    await subCategory.deleteOne();

    return res.status(200).json({ status: true, message: "subCategory has been deleted by the admin." });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//get subCategory
exports.get = async (req, res) => {
  try {
    const subCategory = await SubCategory.find().populate("category", "name").sort({ createdAt: -1 });

    return res.status(200).json({ status: true, message: "Retrive subcategories by the admin.", subCategory: subCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server error" });
  }
};

//get category wise subCategory for admin panel and seller
exports.categoryWiseSubCategory = async (req, res) => {
  try {
    if (!req.query.categoryId) {
      return res.status(200).json({ status: false, message: "categoryId is required!!" });
    }

    const category = await Category.findById(req.query.categoryId);
    if (!category) {
      return res.status(200).json({ status: false, message: "category does not found!!" });
    }

    const subCategories = await SubCategory.find({ category: category._id }).populate("category", "name");

    if (subCategories.length === 0) {
      return res.status(200).json({ status: false, message: "subcategories does not found for this category." });
    }

    const data = [];
    for (const subCategory of subCategories) {
      const sameSubcategoryProductCount = await Product.countDocuments({ subCategory: subCategory._id });

      data.push({
        subCategoryId: subCategory._id,
        name: subCategory.name,
        image: subCategory.image,
        category: subCategory.category.name,
        categoryId: subCategory.category._id,
        sameSubcategoryProductCount,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Retrive category wise all subCategory!",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};
