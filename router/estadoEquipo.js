
const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { check, validationResult } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET METHOD ROUTE

router.get('/', [validarJWT, validarRolAdmin ], async (req, res) => {
    try {
        const estadosEquipos = await EstadoEquipo.find();
        res.send(estadosEquipos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

// POST METHOD ROUTE

router.post('/', [validarJWT, validarRolAdmin ], [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('estado', 'Estado no es válido').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { nombre, estado } = req.body;

        const existeEstadoEquipo = await EstadoEquipo.findOne({ nombre });
        if (existeEstadoEquipo) {
            return res.status(400).json({ mensaje: 'El estado de equipo ya existe' });
        }

        let estadoEquipo = new EstadoEquipo({ nombre, estado });
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.json(estadoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

// PUT METHOD ROUTE

router.put('/:id', [validarJWT, validarRolAdmin ], [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('estado', 'Estado no es válido').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { nombre, estado } = req.body;

        let estadoEquipo = await EstadoEquipo.findById(req.params.id);
        if (!estadoEquipo) {
            return res.status(404).json({ mensaje: 'Estado de equipo no encontrado' });
        }

        estadoEquipo.nombre = nombre;
        estadoEquipo.estado = estado;
        estadoEquipo.fechaActualizacion = new Date();

        await estadoEquipo.save();

        res.json(estadoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

// DELETE METHOD ROUTE

router.delete('/:id', [validarJWT, validarRolAdmin ], async (req, res) => {
    try {
        let estadoEquipo = await EstadoEquipo.findById(req.params.id);
        if (!estadoEquipo) {
            return res.status(404).json({ mensaje: 'Estado de equipo no encontrado' });
        }

        await estadoEquipo.deleteOne();

        res.json({ mensaje: 'Estado de equipo eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;