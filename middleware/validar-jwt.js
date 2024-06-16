
const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token en la petición' });
    }

    try {
        const payload = jwt.verify(token, '270591');
        req.payload = payload; // Corrección aquí
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ mensaje: 'Token no válido' });
    }
}

module.exports = {
    validarJWT
}
