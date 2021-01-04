const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  age: {
    type: Number,
    // required: true,
  },
  semester: {
    type: String,
    // required: true,
  },
  marks: {
    type: String,
  },
  postedBy: {
    type: ObjectId,

    ref: "Admin",
  },
});
mongoose.model("Student", studentSchema);
