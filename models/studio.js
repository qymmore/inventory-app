const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudioSchema = new Schema({
  name: { type: String, required: true},
  location: { type: String, required: true},
});

StudioSchema.virtual("url").get(function () {
  return `/catalog/studio/${this._id}`;
});

module.exports = mongoose.model("Studio", StudioSchema);