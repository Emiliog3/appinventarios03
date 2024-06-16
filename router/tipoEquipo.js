const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { check, validationResult } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

// GET METHOD ROUTE

router.get('/', [validarJWT, validarRolAdmin ], async (req, res) => {
    try {
        const tiposEquipos = await TipoEquipo.find();
        res.send(tiposEquipos);
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

        const existeTipoEquipo = await TipoEquipo.findOne({ nombre });
        if (existeTipoEquipo) {
            return res.status(400).json({ mensaje: 'El tipo de equipo ya existe' });
        }

        let tipoEquipo = new TipoEquipo({ nombre, estado });
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        res.json(tipoEquipo);
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

        let tipoEquipo = await TipoEquipo.findById(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).json({ mensaje: 'Tipo de equipo no encontrado' });
        }

        tipoEquipo.nombre = nombre;
        tipoEquipo.estado = estado;
        tipoEquipo.fechaActualizacion = new Date();

        await tipoEquipo.save();

        res.json(tipoEquipo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

// DELETE METHOD ROUTE

router.delete('/:id', [validarJWT, validarRolAdmin ], async (req, res) => {
    try {
        let tipoEquipo = await TipoEquipo.findById(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).json({ mensaje: 'Tipo de equipo no encontrado' });
        }

        await tipoEquipo.deleteOne();

        res.json({ mensaje: 'Tipo de equipo eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;

