const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name:
    {
      type: String,
      required: true
    },
    imageUrl:
      { type: String },
    club:
    {
      type: String,
      required: true
    },
    position:
    {
      type: String,
      required: true
    },
    goals:
    {
      type: Number,
      required: true
    },
    isCaptain:
    {
      type: Boolean,
      required: true
    },
    nation:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'nations',
      required: true
    },
  },
  {
    timestamps: true,
  }
);
var Players = mongoose.model("players", playerSchema);
module.exports = Players;
