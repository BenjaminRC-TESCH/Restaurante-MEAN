const { Schema, model } = require('mongoose');

const OrderSchema = new Schema(
    {
        products: [
            {
                productId: { type: String },
                contador: { type: Number },
            },
        ],
        total: { type: String, required: true },
        estado: { type: String, required: true },
        clientId: { type: String, required: true },
        direccion: { type: String, required: true },
    },
    {
        timestams: true,
    }
);

module.exports = model('order', OrderSchema);
