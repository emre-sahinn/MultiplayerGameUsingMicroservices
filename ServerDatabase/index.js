const mongoose = require('mongoose');
const express = require('express');
const Server = require('./models/server');
var cors = require('cors');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

//add new game server
app.post("/api/server/add", async (req, res) => {
  try {
    console.log(req.body);
    const checkDuplicate = await Server.findOne({ IP: req.body.IP, port: req.body.port });
    if (checkDuplicate) {
      return res.status(400).json("server already exists");
    }
    
    //create server record
    const newServer = new Server({
      IP: req.body.IP,
      port: req.body.port,
    });

    //save server and respond
    const server = await newServer.save();
    res.status(200).json("server added");
  } catch (err) {
      console.log(err);
    res.status(500).json(err)
  }
});

app.get("/api/server/list", async (req, res) => {
  console.log(req.body);
  const serverList = await Server.find({});
  res.send(serverList);
  console.log(serverList);
});

app.post("/api/server/remove", async (req, res) => {
  console.log(req.body);
  const result = await Server.deleteOne({IP: req.body.IP, port: req.body.port});
  res.send(result.deletedCount != 0);
  console.log(result);
});

const port= process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`localhost:${port} started.`);
});
