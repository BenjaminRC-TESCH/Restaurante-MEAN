const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        clientId: String,
        product: [
            {
                productId: { type: String },
                contador: { type: Number, default: 1 },
            },
        ],
    },
    {
        timestams: true,
    }
);

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
