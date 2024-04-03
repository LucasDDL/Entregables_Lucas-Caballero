import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    price: {type: Number, require: true},
    code: {type: String, require: true},
    stock: {type: Number, require: true},
    category: {type: String, require: true},
    status: {type: Boolean, default: true},
    id: Number
}, {
    versionKey: false,
})

const Product = mongoose.model('Product', productSchema, 'products');

export default Product