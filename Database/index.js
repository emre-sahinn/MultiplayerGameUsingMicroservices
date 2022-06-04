const express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/login", (req, res) => {
    res.send("hello from database");
});

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