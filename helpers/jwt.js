const jwt = require('jsonwebtoken');

const generarJWT = (usuario) => {

    const payload = { uid: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, estado: usuario.estado, password: usuario.password, estado: usuario.estado };

    const token = jwt.sign(payload, '270591', { expiresIn: '100h' }); // 2 horas desde el momento de la creación del token
    return token;
}

module.exports = {
    generarJWT

}
