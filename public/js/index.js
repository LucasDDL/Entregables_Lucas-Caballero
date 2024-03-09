const socket = io();

socket.on('saludo', (data) => {
    console.log(data);
})

socket.on('products-updated', (data) => {
    alert(data.message);
    updateProductList(data.products)
})

function updateProductList(products) {
    const productList = document.querySelector('ul');
    productList.innerHTML = '';

    products.forEach(product => {
        const listItem = document.createElement('li')
        listItem.innerHTML = `
            <p>Titulo: ${product.title}</p>
            <p>Descripción: ${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        productList.appendChild(listItem);
    });
}