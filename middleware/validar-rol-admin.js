const jwt = require('jsonwebtoken');

const validarRolAdmin = (req, res, next) => {
    // Verifica si req.payload está definido y tiene la propiedad rol
    if (!req.payload || req.payload.rol !== 'Administrador') {
        return res.status(401).json({ mensaje: 'No tienes permisos para realizar esta acción' });
    }

    next();
}

module.exports = {
    validarRolAdmin
}
