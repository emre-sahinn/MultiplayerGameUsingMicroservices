const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require("./routes/users");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb+srv://MicroserviceProject:mongo.123@microserviceproject.gbycla6.mongodb.net/?retryWrites=true&w=majority", {

    useNewUrlParser: true,
  
    useUnifiedTopology: true,
  
  }).then(() => console.log("Database connected!"))
  
    .catch(err => console.log(err));

app.post("/api/login", (req, res) => {
    res.send("hello from database");
});

app.use("/api/users", userRoute);

app.get("*", (req, res) => {
    res.status(404).send("Get API not found.");
});

app.post("*", (req, res) => {
    res.status(404).send("Post API not found.");
});

const port= process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`localhost:${port} started.`);
});