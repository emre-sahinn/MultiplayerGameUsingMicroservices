const express = require('express');
const bodyParser = require('body-parser');
const databaseRoute = require('./Routes/DatabaseRoute/databaseRoute');
const gameRoute = require('./Routes/GameRoute/gameRoute');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/database',  databaseRoute);
app.use('/api/game',  gameRoute);

app.post("/api/test", (req, res) => {
    res.send(req.body);
});

app.get("*", (req, res) => {
    res.status(404).send("Get API not found.");
});

app.post("*", (req, res) => {
    res.status(404).send("Post API not found.");
});

const port= process.env.PORT || 80;
app.listen(port, () => {
  console.log(`localhost:${port} started.`);
});