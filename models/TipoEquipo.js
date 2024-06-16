const { Schema, model } = require('mongoose');

const TipoEquipoSchema = Schema({

    nombre: { type: String, required: true },
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = model('TipoEquipo', TipoEquipoSchema);