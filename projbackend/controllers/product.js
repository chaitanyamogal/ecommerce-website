const Product = require("../models/product");
const formidable = require("formidable"); //used to handle the upload of files
const _ = require("lodash");
const fs = require("fs"); // file system module inbuilt in nodejs

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true; // keeps extension of files, eg. png, jpeg,

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //destructure the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }

    // creating product model with fields
    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        // checking the size of file. if greater then 3MB show error.
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed"
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//Middleware ----to optimizing loading of photo of product
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//deleteProduct controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        errror: "Failed to delete the product"
      });
    }
    res.json({
      message: "Deleted product successfully",
      deletedProduct
    });
  });
};

//updateProduct controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true; // keeps extension of files, eg. png, jpeg,

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    // updation of product
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        // checking the size of file. if greater then 3MB show error.
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(product);
    });
  });
};

//listing all products on home page
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo") // -photo means don't select photo
    .populate("category")
    .sort([[sortBy, "asc"]]) //use to sort products
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.ststus(400).json({
          error: "No product found"
        });
      }
      res.json(products);
    });
};

//getting all categories from Product model
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("caterory", {}, (err, category) => {
    if (err) {
      return res.ststus(400).json({
        error: "No category found"
      });
    }
    res.json(category);
  });
};

//
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }
      }
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.ststus(400).json({
        error: "Bulk operation failed"
      });
    }
    next();
  });
};
