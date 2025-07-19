const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello, World! aplicacion de cambios');
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080 aplicacion de cambios');
});