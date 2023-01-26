const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    inStock: {
        type: Number,
        required: true,
        min: 1,
    },
    URL: {
        type: String,
        required: true,
    }
});

ItemsSchema.virtual('url').get(function() {
    return `/categories/items/${this._id}`;
});

module.exports = mongoose.model('Items', ItemsSchema);