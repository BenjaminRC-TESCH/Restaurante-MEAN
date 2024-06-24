const { Router } = require('express');
const upload = require('../config/multerConfig');
const router = Router();

const {
    getProducts,
    addToCart,
    getCartItems,
    removeFromCart,
    deleteFromCart,
    getUserProfile,
    updateUserProfile,
    createOrder,
    getUserOrders,
} = require('../controllers/user/user.controller');

const { checkTokenUser } = require('../middleware/auth');

//Manejar acciones del usuario con productos
router.get('/user/get/products', getProducts);
router.post('/user/cart/add', checkTokenUser, addToCart);

//Manejar acciones del agrregar productos al carrito
router.post('/user/cart/items', checkTokenUser, getCartItems);
router.post('/user/cart/remove', checkTokenUser, removeFromCart);
router.post('/user/cart/delete', checkTokenUser, deleteFromCart);

//Manejar acciones del generar ordenes
router.post('/user/create/order', checkTokenUser, createOrder);
router.post('/user/get/orders', checkTokenUser, getUserOrders);

//Obtener el perfil del usuario
router.post('/user/get/profile', checkTokenUser, getUserProfile);
router.put('/user/update/profile', checkTokenUser, updateUserProfile);

module.exports = router;
