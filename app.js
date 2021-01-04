const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3000;
const { MONGOURI } = require("./keys");

//connect to mongodb

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb atlas");
});

// if some error in connection

mongoose.connection.on("error", (err) => {
  console.log("error in connecting", err);
});

require("./models/Admin");
require("./models/Student");
app.use(express.json());
app.use(require("./routes/adminAuth"));
app.use(require("./routes/student"));

// app is runnung on this port

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
