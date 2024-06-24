const { Schema, model } = require('mongoose');

const productsSchema = new Schema(
    {
        nombre: { type: String },
        descripcion: { type: String },
        precio: { type: Number },
        categoria: { type: String },
        imagen: { type: String },
    },
    { timestamps: true }
);

module.exports = model('Product', productsSchema);
