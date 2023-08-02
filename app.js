import express from 'express';

import __dirname from './utils.js';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
const app = express(); //Recibimos una peticion

app.use(express.json()); //Me permite leer json en las peticiones

app.use(express.urlencoded({extended:true})); //Objetos codificados desde URL

app.use(express.static(`./${__dirname}/public`)) //Dejo esto preparado para luego hacer un home.

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080,()=>{
    console.log("Listening in port 8080")
});