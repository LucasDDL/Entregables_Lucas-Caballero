import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    id: Number,
    products: [{id: Number, quantity: Number}]
}, {
    versionKey: false
})

const Cart = mongoose.model('Cart', cartSchema);

export default Cart