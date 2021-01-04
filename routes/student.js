const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const requireSignin = require("../middleware/requireSignin");
const Student = mongoose.model("Student");

// Add A New student
router.post("/createstudent", requireSignin, (req, res) => {
  const { name, email, age, semester } = req.body;
  if (!name || !email || !age || !semester) {
    return res
      .status(422)
      .json({ success: false, msg: "please add all the fields" });
  }
  req.admin.password = undefined;
  const student = new Student({
    name,
    email,
    age,
    semester,
    postedBy: req.admin,
  });
  student
    .save()
    .then((result) => {
      res.json({ student: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// list of all student

router.get("/allstudent", requireSignin, (req, res, next) => {
  Student.find({}, (err, studentsList) => {
    if (err) return next(err);
    res.json(studentsList);
  });
});

// get single student

router.get("/:id", requireSignin, (req, res, next) => {
  Student.findById(req.params.id, (err, SingleStudent) => {
    if (err) return next(err);
    res.json({ SingleStudent });
  });
});

// update student

router.put("/:id", requireSignin, (req, res, next) => {
  Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, UpdateStudent) => {
      if (err) return next(err);
      res.json({ UpdateStudent });
    }
  );
});

// update a part of student

router.patch("/:id", requireSignin, (req, res, next) => {
  Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedStudent) => {
      if (err) return next(err);
      res.json({ updatedStudent });
    }
  );
});

// delete student

router.delete("/:id", requireSignin, (req, res, next) => {
  Student.findByIdAndDelete(req.params.id, (err, deletedStudent) => {
    if (err) return next(err);
    res.json({ deletedStudent });
  });
});

module.exports = router;
