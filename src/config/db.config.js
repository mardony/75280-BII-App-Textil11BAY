import mongoose from 'mongoose'; //
import dotenv from 'dotenv'; //

dotenv.config(); //

const MONGO_URI = process.env.MONGO_URI; //

/**
 * Función para conectar a la base de datos MongoDB.
 * Utiliza la URI de conexión definida en las variables de entorno.
 */
const connectDB = async () => { //
    try {
        await mongoose.connect(MONGO_URI); //
        console.log('MongoDB Conectado Correctamente'); //
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message); //
        process.exit(1); //
    }
};

export default connectDB; //