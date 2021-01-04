const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireSignin = require("../middleware/requireSignin");

router.get("/protected", requireSignin, (req, res) => {
  res.send("hiii");
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    res.status(422).json({ error: "please fill all the details" });
  }
  Admin.findOne({ email: email }).then((savedAdmin) => {
    if (savedAdmin) {
      return res
        .status(422)
        .json({ error: "Admin already exists with that email" });
    }
    bcrypt.hash(password, 10).then((hashedPassword) => {
      const admin = new Admin({
        email,
        password: hashedPassword,
        name,
      });
      admin
        .save()
        .then((admin) => {
          res.json({ admin, message: "saved succesfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  Admin.findOne({ email }).then((savedAdmin) => {
    if (!savedAdmin) {
      return res
        .status(422)
        .json({ success: false, msg: "invaild email or password" });
    }
    bcrypt
      .compare(password, savedAdmin.password)
      .then((doMatch) => {
        if (doMatch) {
          //   res.json({ success: true, msg: "succesfully sign in" });
          const token = jwt.sign({ _id: savedAdmin._id }, JWT_SECRET);
          // const { _id, name, email } = savedAdmin;
          res.json({
            token,
            // admin: { _id, name, email },
            success: true,
            msg: "token generated",
          });
        } else {
          return res
            .status(422)
            .json({ success: false, msg: "please add email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
module.exports = router;
