const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    URL: {
        type: String,
        required: true
    },
});

CategorySchema.virtual('url').get(function() {
    return `/categories`;
});

module.exports = mongoose.model('Category', CategorySchema);