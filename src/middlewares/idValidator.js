export default function idValidator(paramName) {
    return function(req, res, next) {
        const id = +req.params[paramName];
        switch (paramName) {
            case 'pid':
                if (isNaN(id)) {
                    const error = new Error('Id de producto invalido');
                    error.status = 404;
                    next(error);
                } else {
                    next();
                }
                break;
            case 'cid':
                if (isNaN(id)) {
                    const error = new Error('Id de carrito invalido');
                    error.status = 404;
                    next(error);
                } else {
                    next();
                }
                break;
            default:
                next();
        }
    }
}