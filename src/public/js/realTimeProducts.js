// Connect the client to the Socket.IO server
const socket = io(); //

// DOM elements
const productsList = document.getElementById('products-list'); //
const productForm = document.getElementById('product-form'); //
const deleteForm = document.getElementById('delete-form'); //

// Listen for the 'updateProducts' event from the server
socket.on('updateProducts', (products) => { //
    productsList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `ID: ${product._id}, Título: ${product.title}, Precio: $${product.price}, Stock: ${product.stock}`;
        productsList.appendChild(li);
    });
});

// Handle form submission to add a product
if (productForm) { //
    productForm.addEventListener('submit', (e) => { //
        e.preventDefault();

        const title = productForm.title.value; //
        const description = productForm.description.value; //
        const code = productForm.code.value; //
        const price = parseFloat(productForm.price.value); //
        const stock = parseInt(productForm.stock.value); //
        const category = productForm.category.value; //
        const thumbnail = productForm.thumbnail.value;

        const productData = { title, description, code, price, stock, category }; //

        if (thumbnail) {
            productData.thumbnails = [thumbnail]; //
        }

        socket.emit('addProduct', productData); //

        productForm.reset(); //
    });
}

// Handle form submission to delete a product
if (deleteForm) { //
    deleteForm.addEventListener('submit', (e) => { //
        e.preventDefault();

        const productId = deleteForm.productId.value;

        socket.emit('deleteProduct', productId);

        deleteForm.reset(); //
    });
}

console.log("realTimeProducts.js loaded and connecting to Socket.IO"); //