import mongoose from 'mongoose'; //
import mongoosePaginate from 'mongoose-paginate-v2'; //

// Define the schema for products
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true }, //
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
}); //

// Apply the pagination plugin to the schema
productSchema.plugin(mongoosePaginate);

// Create the Product model from the schema
const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel; //