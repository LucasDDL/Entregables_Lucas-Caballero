import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    id: Number,
    products: [{ 
        product: { 
            type: mongoose.Schema.Types.ObjectId,             
            ref: 'Product' 
        }
    }],
   
}, {
    versionKey: false 
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;