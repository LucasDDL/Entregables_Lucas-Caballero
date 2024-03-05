export default function errorHandler(error, req, res, next ) {
    console.error(error);
    if (error.message === 'Not Found') {
        return res.status(404).send({error: 'El producto no existe'});
    }
    if (error.message === 'Id de producto invalido') {
        return res.status(400).send({error: 'Id de producto invalido'})
    }
    if (error.message === 'Id de cart invalido') {
        return res.status(400).send({error: 'Id de cart invalido'})
    }
    if (error.message === 'Cart not found') {
        return res.status(404).send({error: 'El carrito no existe'})
    }
    res.status(500).send({error: 'Error interno del servidor'});
}

