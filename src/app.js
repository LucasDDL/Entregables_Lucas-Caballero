import  express from "express";
import productsRouter from "./routes/products.route.js"
import cartsRouter from './routes/carts.route.js'
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use(errorHandler)

app.listen(8080, ()=>console.log('servidor escuchando en el puerto 8080'))