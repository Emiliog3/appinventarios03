
const { Router } = require('express');
const Marca = require('../models/Marca');
const { check, validationResult } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();


// GET METHOD ROUTE

router.get('/', [validarJWT, validarRolAdmin ], async function (req, res) {
    try {
        const marcas = await Marca.find(); // Busca todas las marcas
        res.send(marcas);
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

        const existeMarca = await Marca.findOne({ nombre }); // Busca si la marca ya existe
        
        if (existeMarca) {
            return res.status(400).json({ mensaje: 'La marca ya existe' });
        }

        let marca = new Marca();
        marca.nombre = nombre;
        marca.estado = estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save(); // Guarda la marca en la base de datos

        res.json(marca);
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

        let marca = await Marca.findById(req.params.id); // Busca la marca por su ID
        if (!marca) {
            return res.status(404).json({ mensaje: 'Marca no encontrada' });
        }

        marca.nombre = nombre;
        marca.estado = estado;
        marca.fechaActualizacion = new Date();

        await marca.save(); // Actualiza la marca en la base de datos

        res.json(marca);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
});


// DEL METHOD ROUTE

router.delete('/:id', [validarJWT, validarRolAdmin ], async (req, res) => {
    try {
        let marca = await Marca.findById(req.params.id); // Busca la marca por su ID
        if (!marca) {
            return res.status(404).json({ mensaje: 'Marca no encontrada' });
        }

        await marca.deleteOne(); // Elimina la marca de la base de datos

        res.json({ mensaje: 'Marca eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor. Marca no encontrada');
    }
});

module.exports = router;
