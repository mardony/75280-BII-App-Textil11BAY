import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; //

// Define the schema for products within a cart
const cartProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
}, { _id: false }); //

// Define the schema for carts
const cartSchema = new mongoose.Schema({
    products: { type: [cartProductSchema], default: [] }
}); //

// Apply the pagination plugin to the cart schema (optional)
cartSchema.plugin(mongoosePaginate);

// Create the Cart model from the schema
const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel; //