import { Router } from 'express'; //
import ProductModel from '../models/product.model.js'; //

const viewsRouter = Router(); //

// Route for the "home.handlebars" view that lists all products
viewsRouter.get('/', async (req, res) => { //
    try {
        const { limit = 10, page = 1, sort, query } = req.query; //
        const options = { //
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true, //
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined, //
        };

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

        const productsData = await ProductModel.paginate(filter, options); //

        // Prepare pagination links for the view
        const buildLink = (pageNumber) => { //
            const newParams = new URLSearchParams(req.query); //
            newParams.set('page', pageNumber); //
            return `/?${newParams.toString()}`; //
        };

        res.render('home', { //
            products: productsData.docs,
            page: productsData.page,
            totalPages: productsData.totalPages,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            prevLink: productsData.hasPrevPage ? buildLink(productsData.prevPage) : null,
            nextLink: productsData.hasNextPage ? buildLink(productsData.nextPage) : null,
        });
    } catch (error) { //
        console.error('Error al renderizar home:', error); //
        res.status(500).send('Error al cargar la página de productos.'); //
    }
});

// Route for the "realTimeProducts.handlebars" view with WebSockets
viewsRouter.get('/realtimeproducts', async (req, res) => { //
    try {
        const products = await ProductModel.find().lean(); //
        res.render('realTimeProducts', { products }); //
    } catch (error) { //
        console.error('Error al renderizar realTimeProducts:', error); //
        res.status(500).send('Error al cargar la página de productos en tiempo real.'); //
    }
});

export default viewsRouter; //
