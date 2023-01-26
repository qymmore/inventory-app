const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
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

CategoriesSchema.virtual('url').get(function() {
    return `/categories`;
});

module.exports = mongoose.model('Categories', CategoriesSchema);