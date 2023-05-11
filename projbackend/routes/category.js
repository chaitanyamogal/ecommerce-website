const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Category create route
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

//Category read routes
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//Category update route
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//Category delete route
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
