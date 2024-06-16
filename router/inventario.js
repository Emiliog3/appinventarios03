const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { check, validationResult } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');


const router = Router();




// GET METHOD ROUTE
router.get('/', [validarJWT], async (req, res) => {
    try {
        const inventarios = await Inventario.find().populate([
            { path: 'usuario', select: 'nombre email estado' },
            { path: 'marca', select: 'nombre estado' },
            { path: 'tipoEquipo', select: 'nombre estado' },
            { path: 'estadoEquipo', select: 'nombre estado' }
        ]);



        res.send(inventarios);

        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});








// POST METHOD ROUTE
router.post('/', [validarJWT, validarRolAdmin ], [
    check('serial', 'Serial es requerido').not().isEmpty(),
    check('modelo', 'Modelo es requerido').not().isEmpty(),
    check('descripcion', 'Descripción es requerida').not().isEmpty(),
    check('fotoEquipo', 'Foto de equipo es requerida').not().isEmpty(),
    check('color', 'Color es requerido').not().isEmpty(),
    check('fechaCompra', 'Fecha de compra es requerida').isISO8601().toDate(),
    check('precioCompra', 'Precio de compra es requerido').isNumeric(),
    check('usuario', 'Usuario es requerido').not().isEmpty(),
    check('marca', 'Marca es requerida').not().isEmpty(),
    check('tipoEquipo', 'Tipo de equipo es requerido').not().isEmpty(),
    check('estadoEquipo', 'Estado de equipo es requerido').not().isEmpty()

], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const existeSerial = await Inventario.findOne({ serial: req.body.serial });
        if (existeSerial) {
            return res.status(400).json({ mensaje: 'El serial ya existe' });
        }

        let inventario = new Inventario(req.body);
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

// PUT METHOD ROUTE
router.put('/:id', [validarJWT, validarRolAdmin ], [
    check('serial', 'Serial es requerido').not().isEmpty(),
    check('modelo', 'Modelo es requerido').not().isEmpty(),
    check('descripcion', 'Descripción es requerida').not().isEmpty(),
    check('fotoEquipo', 'Foto de equipo es requerida').not().isEmpty(),
    check('color', 'Color es requerido').not().isEmpty(),
    check('fechaCompra', 'Fecha de compra es requerida').isISO8601().toDate(),
    check('precioCompra', 'Precio de compra es requerido').isNumeric(),
    check('usuario', 'Usuario es requerido').not().isEmpty(),
    check('marca', 'Marca es requerida').not().isEmpty(),
    check('tipoEquipo', 'Tipo de equipo es requerido').not().isEmpty(),
    check('estadoEquipo', 'Estado de equipo es requerido').not().isEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { serial, modelo, descripcion, fotoEquipo, color, fechaCompra, precioCompra, usuario, marca, tipoEquipo, estadoEquipo } = req.body;

        let inventario = await Inventario.findById(req.params.id);
        if (!inventario) {
            return res.status(404).json({ mensaje: 'Inventario no encontrado' });
        }

        inventario.serial = serial;
        inventario.modelo = modelo;
        inventario.descripcion = descripcion;
        inventario.fotoEquipo = fotoEquipo;
        inventario.color = color;
        inventario.fechaCompra = fechaCompra;
        inventario.precioCompra = precioCompra;
        inventario.usuario = usuario;
        inventario.marca = marca;
        inventario.tipoEquipo = tipoEquipo;
        inventario.estadoEquipo = estadoEquipo;
        inventario.fechaActualizacion = new Date();

        await inventario.save();

        res.json(inventario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

// DELETE METHOD ROUTE
router.delete('/:id', [validarJWT, validarRolAdmin ], async (req, res) => {
    try {
        let inventario = await Inventario.findById(req.params.id);
        if (!inventario) {
            return res.status(404).json({ mensaje: 'Inventario no encontrado' });
        }

        await inventario.deleteOne();

        res.json({ mensaje: 'Inventario eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
