import { Router } from 'express'; //
import ProductModel from '../models/product.model.js'; //

const productsRouter = Router(); //

let io; //
export const setIo = (socketIoInstance) => { //
    io = socketIoInstance;
}; //

// GET /api/products/
// Lists all products with filters, pagination, and sorting
productsRouter.get('/', async (req, res) => { //
    try {
        const { limit = 10, page = 1, sort, query } = req.query; //
        const options = { //
            page: parseInt(page), //
            limit: parseInt(limit), //
            lean: true, //
        };

        // Apply sorting by price if 'sort' is present
        if (sort === 'asc') { //
            options.sort = { price: 1 }; //
        } else if (sort === 'desc') { //
            options.sort = { price: -1 }; //
        }

        // Build the search filter
        const filter = {}; //
        if (query) { //
            filter.$or = [ //
                { category: query },
                { status: query === 'true' ? true : query === 'false' ? false : undefined }
            ];
            if (filter.$or[2] && filter.$or[2].status === undefined) { //
                delete filter.$or[2];
            }
        }

        const products = await ProductModel.paginate(filter, options); //

        // Build pagination links
        const buildLink = (pageNumber) => { //
            const newParams = new URLSearchParams(req.query); //
            newParams.set('page', pageNumber); //
            return `/api/products?${newParams.toString()}`; //
        };

        const response = { //
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? buildLink(products.prevPage) : null, //
            nextLink: products.hasNextPage ? buildLink(products.nextPage) : null, //
        };

        res.json(response); //
    } catch (error) { //
        console.error('Error al listar productos:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al listar productos', error: error.message }); //
    }
});

// GET /api/products/:pid
// Retrieves only the product with the provided ID
productsRouter.get('/:pid', async (req, res) => { //
    try {
        const { pid } = req.params; //
        const product = await ProductModel.findById(pid).lean(); //

        if (!product) { //
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' }); //
        }
        res.json({ status: 'success', payload: product }); //
    } catch (error) { //
        console.error('Error al obtener producto por ID:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al obtener producto', error: error.message }); //
    }
});

// POST /api/products/
// Adds a new product
productsRouter.post('/', async (req, res) => { //
    try {
        const newProductData = req.body; //
        const product = await ProductModel.create(newProductData); //

        // Emit WebSocket event to update real-time view
        if (io) { //
            const products = await ProductModel.find().lean(); //
            io.emit('updateProducts', products); //
        }

        res.status(201).json({ status: 'success', message: 'Producto creado exitosamente', payload: product }); //
    } catch (error) { //
        console.error('Error al crear producto:', error); //
        res.status(400).json({ status: 'error', message: 'Error al crear producto', error: error.message }); //
    }
});

// PUT /api/products/:pid
// Updates a product by its ID
productsRouter.put('/:pid', async (req, res) => { //
    try {
        const { pid } = req.params; //
        const updatedProductData = req.body; //

        // Prevent updating or deleting the ID
        if (updatedProductData._id) delete updatedProductData._id; //
        if (updatedProductData.id) delete updatedProductData.id; //

        const updatedProduct = await ProductModel.findByIdAndUpdate(pid, updatedProductData, { new: true, runValidators: true }).lean(); //

        if (!updatedProduct) { //
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado para actualizar' }); //
        }

        // Emit WebSocket event to update real-time view
        if (io) { //
            const products = await ProductModel.find().lean(); //
            io.emit('updateProducts', products); //
        }

        res.json({ status: 'success', message: 'Producto actualizado exitosamente', payload: updatedProduct }); //
    } catch (error) { //
        console.error('Error al actualizar producto:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al actualizar producto', error: error.message }); //
    }
}); //

// DELETE /api/products/:pid
// Deletes a product by its ID
productsRouter.delete('/:pid', async (req, res) => { //
    try {
        const { pid } = req.params; //
        const deletedProduct = await ProductModel.findByIdAndDelete(pid).lean(); //

        if (!deletedProduct) { //
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado para eliminar' }); //
        }

        // Emit WebSocket event to update real-time view
        if (io) { //
            const products = await ProductModel.find().lean(); //
            io.emit('updateProducts', products); //
        }

        res.json({ status: 'success', message: 'Producto eliminado exitosamente', payload: deletedProduct }); //
    } catch (error) { //
        console.error('Error al eliminar producto:', error); //
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al eliminar producto', error: error.message }); //
    }
}); //

export default productsRouter; //
