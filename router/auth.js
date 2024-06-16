const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const router = Router();

// POST METHOD ROUTE - Ruta de inicio de sesión

router.post('/', [
    check('email', 'Email es requerido').isEmail(),
    check('password', 'Contraseña es requerida').not().isEmpty()
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const { email, password } = req.body;

        // Verificar si el usuario existe

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar la contraseña

        const esCorrecta = bcrypt.compareSync(password, usuario.password);
        if (!esCorrecta) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar el token

        const token = generarJWT(usuario);

        res.json({ uid: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, estado: usuario.estado, token });

    } catch (error) {

        console.log(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });

    }
});

module.exports = router;

