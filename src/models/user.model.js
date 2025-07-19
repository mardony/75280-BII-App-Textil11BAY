import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CartModel from './cart.model.js'; // Assuming cart.model.js exists

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

// Pre-save hook to hash password and create a cart
userSchema.pre('save', async function (next) {
    const user = this;

    // Hash password if it's new or modified
    if (user.isModified('password') || user.isNew) {
        user.password = bcrypt.hashSync(user.password, 10);
    }

    // Create a new cart for the user if it's a new user and no cart is assigned
    if (user.isNew && !user.cart) {
        try {
            const newCart = await CartModel.create({});
            user.cart = newCart._id;
        } catch (error) {
            console.error('Error creating cart for user:', error);
            return next(error);
        }
    }

    next();
});

const User = mongoose.model('User', userSchema);

export default User;