
const { Schema, model } = require('mongoose');

const InventarioSchema = Schema({
    serial: { type: String, required: true, unique: true },
    modelo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fotoEquipo: { type: String, required: true },
    color: { type: String, required: true },
    fechaCompra: { type: Date, required: true },
    precioCompra: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    marca: { type: Schema.Types.ObjectId, ref: 'Marca', required: true },
    tipoEquipo: { type: Schema.Types.ObjectId, ref: 'TipoEquipo', required: true },
    estadoEquipo: { type: Schema.Types.ObjectId, ref: 'EstadoEquipo', required: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = model('Inventario', InventarioSchema);