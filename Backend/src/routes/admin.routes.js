const { Router } = require('express');
const upload = require('../config/multerConfig');
const router = Router();
const { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/admin/admin.admin');
const { getAllUsers } = require('../controllers/admin/admin.users');
const { getAllCategories, createCategories, updateCategories, deleteCategories } = require('../controllers/admin/admin.categories');
const { getAllRols, createRol, updateRol, deleteRol } = require('../controllers/admin/admin.rols');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/admin/admin.product');
const { getUserOrders } = require('../controllers/admin/admin.orders.js');
const { checkTokenAdmin } = require('../middleware/auth');

/* Rutas para manejar a los administradores */
router.get('/admin/get/admin', checkTokenAdmin, getAllAdmins);
router.post('/admin/create/admin', checkTokenAdmin, createAdmin);
router.put('/admin/update/admin/:id', checkTokenAdmin, updateAdmin);
router.delete('/admin/delete/admin/:id', checkTokenAdmin, deleteAdmin);

/* Rutas para manejar a los usuarios */
router.get('/admin/get/user', checkTokenAdmin, getAllUsers);

/* Rutas para manejar a los productos */
router.get('/admin/get/products', checkTokenAdmin, getProducts);
router.post('/admin/create/product', checkTokenAdmin, upload.single('imagen'), addProduct);
router.put('/admin/update/product/:id', checkTokenAdmin, upload.single('imagen'), updateProduct);
router.delete('/admin/delete/product/:id', checkTokenAdmin, deleteProduct);

/* Rutas para manejar a las categorías */
router.get('/admin/get/categorie', checkTokenAdmin, getAllCategories);
router.post('/admin/create/categorie', checkTokenAdmin, createCategories);
router.put('/admin/update/categorie/:id', checkTokenAdmin, updateCategories);
router.delete('/admin/delete/categorie/:id', checkTokenAdmin, deleteCategories);

/* Rutas para manejar a los roles */
router.get('/admin/get/rol', checkTokenAdmin, getAllRols);
router.post('/admin/create/rol', checkTokenAdmin, createRol);
router.put('/admin/update/rol/:id', checkTokenAdmin, updateRol);
router.delete('/admin/delete/rol/:id', checkTokenAdmin, deleteRol);

/*Rustas para manejar las ordenes*/
router.post('/admin/get/orders', checkTokenAdmin, getUserOrders);

module.exports = router;
