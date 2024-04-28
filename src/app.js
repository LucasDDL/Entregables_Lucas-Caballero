import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import productsRouter from "./routes/products.route.js"
import cartsRouter from './routes/carts.route.js'
import viewsRouter from './routes/views.routes.js'
import sessionRouter from './routes/session.route.js'


import errorHandler from "./middlewares/errorHandler.js";
import { engine } from "express-handlebars";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

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
    app.use(session({
        secret: 'secreto',
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://LucasCaballero:bokitamongo@codertest.3ewwa04.mongodb.net/ecommerce',
            collectionName: 'sessions'
        })
    }))
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(express.static('../public'))

    app.use('/', viewsRouter)
    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/sessions', sessionRouter)

    app.use(errorHandler)

    const httpServer = app.listen(8080, () => console.log('servidor escuchando en el puerto 8080'))
    wsServer = new Server(httpServer);

    wsServer.on('connection', (clientSocket) => {
        console.log(`Cliente conectado, ID: ${clientSocket.id}`);
        clientSocket.emit('saludo', `Cliente conectado, ID: ${clientSocket.id}`)
    })

    
}).catch(error => {
    console.log(new Error(error).stack);
    console.error('Error al conectar al servidor express');
    process.exit(1)
})

export { wsServer };