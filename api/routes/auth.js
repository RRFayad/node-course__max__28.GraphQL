const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid e-mail")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail already exists");
          }
        });
      }),
    body("password", "Please, at least 6 characters")
      .trim()
      .isLength({ min: 6 }),
    body("name").trim().isLength({ min: 3 }),
  ],
  authController.signup
); // Here we are using put, as the user is created only once, it will be created or edited

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  body("status").trim().notEmpty(),
  authController.updateUserStatus
);

module.exports = router;
