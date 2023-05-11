const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signup, signout, signin } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name").isLength({ min: 5 }).withMessage("Name should be at least 3 char"),
    check("email").isEmail().withMessage("Email is required compulsory"),
    check("password").isLength({ min: 3 }).withMessage("Password should be at least 3 char")
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Email is required compulsory"),
    check("password").isLength({ min: 1 }).withMessage("Password fild is required")
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
