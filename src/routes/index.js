import { Router } from 'express'; //
import productsRouter from './products.router.js'; //
import cartsRouter from './carts.router.js'; //
import sessionsRouter from './sessions.router.js';

const apiRouter = Router(); //

// Define routes for products and carts under the /api prefix
apiRouter.use('/products', productsRouter); //
apiRouter.use('/carts', cartsRouter); //
apiRouter.use('/sessions', sessionsRouter);

export default apiRouter; //