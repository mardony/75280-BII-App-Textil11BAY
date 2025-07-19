const express = require('express');
const app = express();

const PORT = 8080;

app.use(express.json());

app.get('/bienvenida', (req, res) => {
    res.send('<h3 style="color: blue;"> Hola atodos pero ahora con Express aplicacion de cambios</h3>');
});

app.get('/saludo', (req, res) => {
    res.send('<h3 style="color: red;"> Hola atodos pero ahora con Express aplicacion de cambios</h3>');
});

app.get('/usuario', (req, res) => {
    res.json({
        nombre: 'Juan',
        apellido: 'Perez',
        edad: 30,
        email: 'juan.perez@example.com'
    });
});

app.get('/usuarios', (req, res) => {
    res.status(200).json([
        {
            nombre: 'Juan',
            apellido: 'Perez',
            edad: 30,
            email: 'juan.perez@example.com'
        },
        {
            nombre: 'Maria',
            apellido: 'Gomez',
            edad: 25,
            email: 'maria.gomez@example.com'
        },
        {
            nombre: 'Pedro',
            apellido: 'Lopez',
            edad: 40,
            email: 'pedro.lopez@example.com'
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto ${PORT}`);
});
