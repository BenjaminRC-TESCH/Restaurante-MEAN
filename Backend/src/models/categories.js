const { Schema, model } = require('mongoose');

const CategorieSchema = new Schema(
    {
        nombre: { type: String, required: true },
    },
    {
        timestams: true,
    }
);

module.exports = model('Categorie', CategorieSchema);
