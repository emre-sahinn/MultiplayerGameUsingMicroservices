const express = require('express');
var cors = require('cors');
const databaseRoute = require('./Routes/DatabaseRoute/databaseRoute');
const gameRoute = require('./Routes/GameRoute/gameRoute');
var app = express();
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/database',  databaseRoute);
app.use('/api/game',  gameRoute);

app.get("*", (req, res) => {
    res.status(404).send("Gateway: Get API not found.");
});

app.post("*", (req, res) => {
    res.status(404).send("Gateway: Post API not found.");
});

const port= process.env.PORT || 80;
app.listen(port);