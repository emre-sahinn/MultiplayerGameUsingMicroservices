const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require("./routes/users");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect("", {

  useNewUrlParser: true,

  useUnifiedTopology: true,

}).then(() => console.log("Database connected!"))

  .catch(err => console.log(err));

app.use("/api/auth", userRoute);

app.get("*", (req, res) => {
  res.status(404).send("Database: Get API not found.");
});

app.post("*", (req, res) => {
  res.status(404).send("Database: Post API not found.");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`localhost:${port} started.`);
});
