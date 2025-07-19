# __APP TEXTIL ONCEBAY - 11BAY__
***
## ✨ __Bienvenido al Repositorio de Oncebay__ ✨
¡Hola! 👋 Te damos la bienvenida a nuestro espacio digital en GitHub. Aquí encontrarás el corazón tecnológico que impulsa la magia de Oncebay, una empresa dedicada a preservar y compartir la belleza de los textiles tradicionales, ¡todos elaborados con el amor y la dedicación de las manos artesanas!

***
## 🧶 __Nuestra Esencia__
En Oncebay, creemos en la historia que cuenta cada hilo y en la pasión que se teje en cada diseño. Nos enorgullece ofrecer productos textiles únicos, creados siguiendo técnicas ancestrales que resuenan con la riqueza cultural de nuestra tradición. Desde tejidos vibrantes hasta prendas con alma, cada pieza es una obra de arte que lleva consigo el legado de generaciones.

## __Estructura App 11BAY__

TEXTIL-11BAY
├── node_modules
├── .env
├── package.json
├── src
│   ├── app.js
│   ├── config
│   │   ├── db.config.js
│   │   └── passport.config.js
│   ├── models
│   │   ├── cart.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── public
│   │   ├── css
│   │   │   └── style.css
│   │   └── js
│   │       └── realTimeProducts.js
│   └── routes
│       ├── carts.router.js
│       ├── index.js
│       ├── products.router.js
│       ├── sessions.router.js
│       └── views.router.js
└── views
    ├── layouts
    │   └── main.handlebars
    ├── home.handlebars
    └── realTimeProducts.handlebars



## 🚀 ¿Qué Encontrarás Aquí?
Este repositorio alberga el código fuente de nuestra plataforma de e-commerce, la cual nos permite conectar nuestros hermosos productos hechos a mano con personas como tú, que valoran la autenticidad y el arte.

Hemos construido este proyecto con tecnologías robustas y modernas para asegurar una experiencia de usuario fluida y segura:

+ Backend con Node.js y Express: El motor de nuestra tienda, gestionando toda la lógica de negocio y las operaciones de nuestra API.

+ Base de Datos MongoDB: Almacenamos nuestros productos, usuarios y carritos de forma eficiente y escalable.

+ Handlebars.js: Para una presentación visual atractiva y dinámica de nuestros productos.

+ Socket.IO: ¡Para una experiencia en tiempo real! Podrás ver las actualizaciones de productos al instante.

+ Sistema de Autenticación y Autorización (JWT & Passport): Garantizando que tus datos estén seguros y que solo tú tengas acceso a tu información.

+ CRUD de Productos y Usuarios: Una gestión completa para mantener nuestro catálogo y la comunidad Oncebay siempre al día.

## tecnologias:
- ![Static Badge](https://img.shields.io/badge/JSON-Notaci%C3%B3n%20de%20Objetos%20JavaScript-blue?style=for-the-badge&logo=JSON&logoColor=red&logoSize=auto)

- ![Static Badge](https://img.shields.io/badge/JAVASCRIPT-para%20webs%2C%20aplicaciones%20m%C3%B3viles%20y%20del%20lado%20del%20servidor-blue?style=for-the-badge&logo=JAVASCRIPT&logoColor=YELOW&logoSize=auto)


## 🔐 Autenticación y Autorización
### Para probar el sistema de autenticación:

- Registra un nuevo usuario (no implementado en este README, pero podrías extender la API para ello).

- Inicia sesión usando el endpoint /api/sessions/login con un POST request que incluya email y password. Recibirás un JWT.

- Accede a la ruta protegida /api/sessions/current enviando el JWT en el encabezado Authorization como Bearer <tu_token_jwt>.

¡Esto es solo el comienzo! Esperamos que disfrutes explorando el código detrás de la artesanía de Oncebay. Si tienes alguna pregunta o sugerencia, ¡no dudes en contactarnos!
