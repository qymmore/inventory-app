const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Unavailable"],
        default: "Available",
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    inStock: {
        type: Number,
        required: true,
    },
    link: {
        type: String,
    }
});

ItemInstanceSchema.virtual('url').get(function() {
    return `/category/iteminstance/${this._id}`;
});

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);


