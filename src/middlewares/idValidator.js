export default function idValidator(paramName, errorMessage) {
    return function(req, res, next) {
        const id = +req.params[paramName];
        if (isNaN(id)) {
            const error = new Error(errorMessage);
            error.status = 404
            next(error)
        } else {
            next()
        } 
    }
} 