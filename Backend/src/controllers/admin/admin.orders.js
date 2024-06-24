const adminOrderCtrl = {};
const passport = require('passport');
const Rol = require('../../models/rols');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*ROLES*/
adminOrderCtrl.getUserOrders = async (req, res) => {
    const { token } = req.body;

    try {
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const clientId = tokenDecoded._id;

        if (!clientId) {
            return res.status(404).json({ error: 'Id del usuario vacío' });
        }

        const orders = await Order.find({ clientId }).lean();

        for (const order of orders) {
            for (const product of order.products) {
                const productDetails = await Product.findById(product.productId);
                if (productDetails) {
                    product.nombre = productDetails.nombre;
                }
            }
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes', details: error });
    }
};

module.exports = adminOrderCtrl;
