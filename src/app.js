import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";

import productsRouter from "./routes/products.route.js"
import cartsRouter from './routes/carts.route.js'
import viewsRouter from './routes/views.routes.js'

import errorHandler from "./middlewares/errorHandler.js";
import { engine } from "express-handlebars";

const app = express();
let wsServer;
async function connectToMongoDB() {
    try {
        await mongoose.connect('mongodb+srv://LucasCaballero:bokitamongo@codertest.3ewwa04.mongodb.net/ecommerce')
        console.log('Conección a MongoDB establecida');
    } catch (error) {
        console.error('Error al conectar con MongoDB');
        process.exit(1)
    }
}

connectToMongoDB().then(() => {
    app.engine('handlebars', engine())
    app.set('view engine', 'handlebars')
    app.set('views', './views')

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use(express.static('../public'))

    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/views', viewsRouter)


    app.use(errorHandler)

    const httpServer = app.listen(8080, () => console.log('servidor escuchando en el puerto 8080'))
    wsServer = new Server(httpServer);

    wsServer.on('connection', (clientSocket) => {
        console.log(`Cliente conectado, ID: ${clientSocket.id}`);
        clientSocket.emit('saludo', `Cliente conectado, ID: ${clientSocket.id}`)
    })

    
}).catch(error => {
    console.error('Error al conectar al servidor express');
    process.exit(1)
})

export { wsServer };