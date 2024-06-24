const userCtrl = {};
const Product = require('../../models/products');
const Cart = require('../../models/cart');
const User = require('../../models/users');
const Order = require('../../models/orders');
const bcrypt = require('bcryptjs');

/* Obtener todos los productos */
userCtrl.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
};

userCtrl.addToCart = async (req, res) => {
    const { productId, token } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ error: 'Token no proporcionado' });
        }

        if (!productId) {
            return res.status(400).json({ error: 'Id del producto no proporcionado' });
        }

        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const clientId = tokenDecoded._id;

        if (!clientId) {
            return res.status(404).json({ error: 'Id del usuario vacío' });
        }

        // Buscar si ya existe un documento con el clientId proporcionado
        let cartItem = await Cart.findOne({ clientId });

        if (cartItem) {
            // Buscar si el producto ya está en el carrito
            const existingProduct = cartItem.product.find((item) => item.productId === productId);

            if (existingProduct) {
                // Si existe, incrementar el contador
                existingProduct.contador += 1;
            } else {
                // Si no existe, agregar el nuevo producto
                cartItem.product.push({ productId, contador: 1 });
            }
        } else {
            // Si no existe un carrito, crear uno nuevo
            cartItem = new Cart({ clientId, product: [{ productId, contador: 1 }] });
        }

        // Guardar el documento actualizado o nuevo
        await cartItem.save();

        res.status(201).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito', details: error });
    }
};

userCtrl.getCartItems = async (req, res) => {
    const { token } = req.body;

    try {
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const clientId = tokenDecoded._id;

        if (!clientId) {
            return res.status(404).json({ error: 'Id del usuario vacío' });
        }

        const cart = await Cart.findOne({ clientId });

        if (!cart || cart.product.length === 0) {
            return res.status(404).json({ error: 'No se encontraron elementos en el carrito' });
        }

        const productDetails = [];
        for (let item of cart.product) {
            const product = await Product.findById(item.productId);
            if (product) {
                productDetails.push({
                    ...product.toObject(),
                    contador: item.contador,
                });
            }
        }

        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los elementos del carrito', details: error });
    }
};

userCtrl.removeFromCart = async (req, res) => {
    const { productId, token } = req.body;

    const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const clientId = tokenDecoded._id;

    try {
        if (!clientId) {
            return res.status(404).json({ error: 'Id del usuario vacio' });
        }

        if (!productId) {
            return res.status(404).json({ error: 'Id del producto vacio' });
        }

        const cart = await Cart.findOne({ clientId });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.product.findIndex((item) => item.productId.toString() === productId);

        if (productIndex > -1) {
            cart.product[productIndex].contador -= 1;
            if (cart.product[productIndex].contador === 0) {
                cart.product.splice(productIndex, 1);
            }
            await cart.save();
            res.status(200).json({ message: 'Producto actualizado en el carrito correctamente' });
        } else {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto en el carrito', details: error });
    }
};

userCtrl.deleteFromCart = async (req, res) => {
    const { productId, token } = req.body;

    const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const clientId = tokenDecoded._id;

    try {
        if (!clientId) {
            return res.status(404).json({ error: 'Id del usuario vacio' });
        }

        if (!productId) {
            return res.status(404).json({ error: 'Id del producto vacio' });
        }

        const cart = await Cart.findOne({ clientId });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.product.findIndex((item) => item.productId.toString() === productId);

        if (productIndex > -1) {
            cart.product.splice(productIndex, 1);
            await cart.save();
            res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
        } else {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito', details: error });
    }
};

userCtrl.createOrder = async (req, res) => {
    const { token, products, total } = req.body;

    if (!token || !products || !total) {
        return res.status(404).json({ error: 'Error campos vacios' });
    }

    if (total == 0) {
        return res.status(404).json({ error: 'Error el precio no puede ser igual a cero' });
    }

    try {
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const clientId = tokenDecoded._id;

        const userFound = await User.findById(clientId);

        if (!clientId) {
            return res.status(404).json({ error: 'Id del usuario vacío' });
        }

        if (!Array.isArray(products) || !products.every((p) => p.productId && p.contador)) {
            return res.status(400).json({ error: 'Formato de productos inválido' });
        }

        const newOrder = new Order({
            products: products,
            total: total,
            estado: 'Pendiente',
            clientId: clientId,
            direccion: userFound.direccion,
        });

        await newOrder.save();

        await Cart.findOneAndDelete({ clientId: clientId });

        res.status(201).json({ message: 'Orden creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la orden', details: error });
    }
};

userCtrl.getUserProfile = async (req, res) => {
    try {
        const { token } = req.body;
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        const idUserDecoded = tokenDecoded._id;

        const user = await User.findById(idUserDecoded).exec();

        if (!user) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil del estudiante' });
    }
};

userCtrl.updateUserProfile = async (req, res) => {
    try {
        let { token, nombre, aPaterno, aMaterno, direccion, telefono, correo, password } = req.body;

        // Eliminar espacios en blanco al principio y al final de cada campo
        token = token.trim();
        nombre = nombre.trim();
        aPaterno = aPaterno.trim();
        aMaterno = aMaterno.trim();
        direccion = direccion.trim();
        telefono = telefono.trim();
        correo = correo.trim();
        if (password) {
            password = password.trim();
        }

        if (!token || !nombre || !aPaterno || !aMaterno || !direccion || !telefono || !correo) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        // Decodificar el token para obtener el ID del alumno
        const tokenDecoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const idUserDecoded = tokenDecoded._id;

        // Expresión regular para validar que el nombre y apellidos contengan solo letras
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(nombre)) {
            return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
        }

        if (!nameRegex.test(aPaterno)) {
            return res.status(400).json({ message: 'Por favor ingresa un apellido paterno válido.' });
        }

        if (!nameRegex.test(aMaterno)) {
            return res.status(400).json({ message: 'Por favor ingresa un apellido materno válido.' });
        }

        // Expresión regular para validar que la direccion
        const direccionRegex = /^[A-Za-z]+$/;
        if (!direccionRegex.test(direccion)) {
            return res.status(400).json({ message: 'Por favor ingresa una dirección valida.' });
        }

        // Expresión regular para validar que el teléfono contiene solo números
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(telefono)) {
            return res.status(400).json({ message: 'Por favor ingresa un número de teléfono válido.' });
        }

        // Expresión regular para validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ message: 'Por favor ingresa un correo electrónico válido.' });
        }

        // Verificar longitud y caracteres especiales de la contraseña
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,12})/;
        if (password && !passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'La contraseña debe tener entre 8 y 12 caracteres, al menos una letra mayúscula y un carácter especial.',
            });
        }

        // Crear objeto de actualización del usuario
        let updateUser = {
            nombre,
            aPaterno,
            aMaterno,
            direccion,
            telefono,
            correo,
        };

        // Si la contraseña está presente y cumple con los requisitos, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateUser.password = hashedPassword;
        }

        // Actualizar el estudiante en la base de datos
        const user = await User.findByIdAndUpdate(idUserDecoded, updateUser, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Enviar la respuesta con el estudiante actualizado
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil del estudiante' });
    }
};

userCtrl.getUserOrders = async (req, res) => {
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

module.exports = userCtrl;
