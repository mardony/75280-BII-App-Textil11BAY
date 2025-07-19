import { Router } from 'express'; //
import CartModel from '../models/cart.model.js'; //
import ProductModel from '../models/product.model.js'; //

const cartsRouter = Router(); //

// POST /api/carts/
// Creates a new cart
cartsRouter.post('/', async (req, res) => { //
    try {
        const newCart = await CartModel.create({}); //
        res.status(201).json({ status: 'success', message: 'Carrito creado exitosamente', payload: newCart }); //
    } catch (error) { //
        console.error('Error al crear carrito:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al crear carrito', error: error.message }); //
    }
}); //

// GET /api/carts/:cid
// Lists the products of a specific cart, populating them completely
cartsRouter.get('/:cid', async (req, res) => { //
    try {
        const { cid } = req.params; //
        const cart = await CartModel.findById(cid).populate('products.product').lean(); //
        if (!cart) { //
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); //
        }
        res.json({ status: 'success', payload: cart }); //
    } catch (error) { //
        console.error('Error al obtener carrito por ID:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al obtener carrito', error: error.message }); //
    }
}); //

// POST /api/carts/:cid/product/:pid
// Adds a product to the cart or increments its quantity if it already exists
cartsRouter.post('/:cid/product/:pid', async (req, res) => { //
    try {
        const { cid, pid } = req.params; //
        const cart = await CartModel.findById(cid); //
        if (!cart) { //
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); //
        }
        const product = await ProductModel.findById(pid); //
        if (!product) { //
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' }); //
        }

        const productInCart = cart.products.find(p => p.product.toString() === pid); //
        if (productInCart) { //
            productInCart.quantity += 1; //
        } else { //
            cart.products.push({ product: pid, quantity: 1 }); //
        }

        await cart.save(); //
        res.status(200).json({ status: 'success', message: 'Producto agregado/actualizado en el carrito', payload: cart }); //
    } catch (error) { //
        console.error('Error al agregar producto al carrito:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al agregar producto al carrito', error: error.message }); //
    }
});

// DELETE /api/carts/:cid/products/:pid
// Deletes a specific product from the cart
cartsRouter.delete('/:cid/products/:pid', async (req, res) => { //
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid); //

        if (!cart) { //
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); //
        }

        const initialLength = cart.products.length; //
        cart.products = cart.products.filter(p => p.product.toString() !== pid); //

        if (cart.products.length === initialLength) { //
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' }); //
        }

        await cart.save(); //
        res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart }); //
    } catch (error) { //
        console.error('Error al eliminar producto del carrito:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al eliminar producto del carrito', error: error.message }); //
    }
});

// PUT /api/carts/:cid
// Updates all products in the cart with a new array of products
cartsRouter.put('/:cid', async (req, res) => { //
    try {
        const { cid } = req.params;
        const { products } = req.body; //
        const cart = await CartModel.findById(cid); //

        if (!cart) { //
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); //
        }

        // Optional validation: check if all products in the array exist
        for (const item of products) { //
            const productExists = await ProductModel.findById(item.product); //
            if (!productExists) { //
                return res.status(400).json({ status: 'error', message: `Producto con ID ${item.product} no encontrado.` }); //
            }
        }

        cart.products = products; //
        await cart.save(); //

        res.json({ status: 'success', message: 'Productos del carrito actualizados completamente', payload: cart }); //
    } catch (error) { //
        console.error('Error al actualizar productos del carrito:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al actualizar productos del carrito', error: error.message }); //
    }
});

// PUT /api/carts/:cid/products/:pid
// Updates ONLY the quantity of a specific product in the cart
cartsRouter.put('/:cid/products/:pid', async (req, res) => { //
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; //

        if (typeof quantity !== 'number' || quantity < 1) { //
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo' }); //
        }

        const cart = await CartModel.findById(cid); //
        if (!cart) { //
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); //
        }

        const productInCart = cart.products.find(p => p.product.toString() === pid); //
        if (!productInCart) { //
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' }); //
        }

        productInCart.quantity = quantity; //
        await cart.save(); //

        res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito', payload: cart }); //
    } catch (error) { //
        console.error('Error al actualizar cantidad del producto en el carrito:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al actualizar cantidad del producto en el carrito', error: error.message }); //
    }
});

// DELETE /api/carts/:cid
// Deletes all products from the cart (empties the cart)
cartsRouter.delete('/:cid', async (req, res) => { //
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid); //

        if (!cart) { //
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' }); //
        }

        cart.products = []; //
        await cart.save(); //
        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito (carrito vacío)', payload: cart }); //
    } catch (error) { //
        console.error('Error al vaciar carrito:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al vaciar carrito', error: error.message }); //
    }
});

export default cartsRouter; //