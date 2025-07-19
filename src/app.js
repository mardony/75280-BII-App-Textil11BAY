import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import initializePassport from './config/passport.config.js'; //
import connectDB from './config/db.config.js'; //
import apiRouter from './routes/index.js'; //
import viewsRouter from './routes/views.router.js'; //
import { setIo as setProductsIo } from './routes/products.router.js'; //
import sessionsRouter from './routes/sessions.router.js';

dotenv.config(); //

const __filename = fileURLToPath(import.meta.url); //
const __dirname = dirname(__filename); //

const app = express(); //
const PORT = process.env.PORT || 8080; //

// Passport configuration
initializePassport();
app.use(passport.initialize());

// HTTP Server and Socket.IO configuration
const httpServer = createServer(app); //
const io = new SocketIOServer(httpServer); //
setProductsIo(io); //

// Express Middleware
app.use(express.json()); //
app.use(express.urlencoded({ extended: true })); //
app.use(express.static(join(__dirname, 'public'))); //

// Handlebars configuration
app.engine('.handlebars', engine({ //
    defaultLayout: 'main', //
    layoutsDir: join(__dirname, 'views', 'layouts'), //
}));
app.set('view engine', '.handlebars'); //
app.set('views', join(__dirname, 'views')); //

// MongoDB Connection
connectDB(); //

// API Routes
app.use('/api', apiRouter); //
app.use('/api/sessions', sessionsRouter);

// View Routes (Handlebars)
app.use('/', viewsRouter); //

// Socket.IO Events
io.on('connection', (socket) => { //
    console.log('Cliente conectado a Socket.IO:', socket.id); //

    socket.on('addProduct', async (productData) => { //
        try {
            const { default: ProductModel } = await import('./models/product.model.js');
            const product = await ProductModel.create(productData); //
            const products = await ProductModel.find().lean(); //
            io.emit('updateProducts', products); //
        } catch (error) {
            console.error('Error al agregar producto via WebSocket:', error); //
            socket.emit('productError', 'Error al agregar producto'); //
        }
    }); //

    socket.on('deleteProduct', async (productId) => { //
        try {
            const { default: ProductModel } = await import('./models/product.model.js');
            const deletedProduct = await ProductModel.findByIdAndDelete(productId); //
            if (deletedProduct) { //
                const products = await ProductModel.find().lean(); //
                io.emit('updateProducts', products); //
            } else { //
                socket.emit('productError', 'Producto no encontrado para eliminar'); //
            }
        } catch (error) { //
            console.error('Error al eliminar producto via WebSocket:', error); //
            socket.emit('productError', 'Error al eliminar producto'); //
        }
    }); //

    socket.on('disconnect', () => { //
        console.log('Cliente desconectado de Socket.IO:', socket.id); //
    }); //
}); //

// Start the HTTP server (which also handles Socket.IO)
httpServer.listen(PORT, () => { //
    console.log(`Servidor escuchando en el puerto ${PORT}`); //
    console.log(`Accede a la aplicación en http://localhost:${PORT}`); //
    console.log(`Accede a la API de productos en http://localhost:${PORT}/api/products`); //
    console.log(`Accede a la vista en tiempo real en http://localhost:${PORT}/realtimeproducts`); //
}); //