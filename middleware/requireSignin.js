const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const Mongoose = require("mongoose");
const Admin = Mongoose.model("Admin");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }
    const { _id } = payload;
    Admin.findById(_id).then((adminData) => {
      req.admin = adminData;
      next();
    });
  });
};
