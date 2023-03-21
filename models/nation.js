const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nationSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    players: { type: Array },
  },
  {
    timestamps: true,
  }
);
var Nations = mongoose.model("nations", nationSchema);
module.exports = Nations;
