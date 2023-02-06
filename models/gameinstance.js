const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: "Game", required: true }, // reference to the associated book
  release_date: {type: Date},
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Available",
  },
  console: {type: String},
  price: {type: Number},
  inStock: {type: Number}
});

// Virtual for gameinstance's URL
GameInstanceSchema.virtual("url").get(function () {
  return `/catalog/gameinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("GameInstance", GameInstanceSchema);
