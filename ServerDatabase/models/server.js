const mongoose = require("mongoose");

const ServerSchema = new mongoose.Schema(
  {
    IP: {
      type: String,
      require: true,
    },
    port: {
      type: String,
      required: true,
      min: 2,
      max: 4,
    },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Server", ServerSchema);
