const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();


// GET METHOD ROUTES

router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
    
    try {
        const usuarios = await Usuario.find(); // select * from usuario
        res.send(usuarios);

    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred on the server');
    }
});


// POST METHOD ROUTE

router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('email', 'Email no es válido').isEmail(),
    check('estado', 'Estado no es válido').isIn(['Activo', 'Inactivo']),
    check('password', 'Contraseña es requerida').not().isEmpty(),
    check('rol', 'Rol no es válido').isIn(['Administrador', 'Docente'])
], async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email }); // select * from usuario where email = req.body.email
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'Email ya existe' });
        }

        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.rol = req.body.rol;

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(req.body.password, salt);

        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save(); // insert into usuario values (req.body)
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred on the server');
    }
});



// PUT METHOD ROUTE

router.put('/:id', [validarJWT, validarRolAdmin ], [

    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('email', 'Email no es válido').isEmail(),
    check('estado', 'Estado no es válido').isIn(['Activo', 'Inactivo']),
    check('rol', 'Rol no es válido').isIn(['Administrador', 'Docente'])

], async function (req, res) {
    
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }
    
            let usuario = await Usuario.findById(req.params.id); // select * from usuario where id = req.params.id
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
    
            usuario.nombre = req.body.nombre;
            usuario.email = req.body.email;
            usuario.estado = req.body.estado;
            usuario.rol = req.body.rol;
            usuario.fechaActualizacion = new Date();
    
            usuario = await usuario.save(); // update usuario set nombre = req.body.nombre, email = req.body.email, estado = req.body.estado, rol = req.body.rol where id = req.params.id
            res.send(usuario);
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occurred on the server');
        }
});



// DEL METHOD ROUTE

router.delete('/:id', [validarJWT, validarRolAdmin ], async function (req, res) {
    try {
        let usuario = await Usuario.findById(req.params.id); // Busca el usuario por su ID
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        await usuario.deleteOne(); // Elimina el usuario encontrado por su ID
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred on the server');
    }
});


module.exports = router;