const adminProduCtrl = {};
const Product = require('../../models/products');

/* Obtener todos los productos */
adminProduCtrl.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
};

/* Agregar un nuevo producto */
adminProduCtrl.addProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria } = req.body;

        if (!nombre || !descripcion || !precio || !categoria) {
            return res.status(404).json({ message: 'Campos vacíos' });
        }

        if (nombre.trim || descripcion.trim || precio.trim || categoria.trim) {
            return res.status(404).json({ message: 'Las descripciones no deben tener espacios en blanco' });
        }

        if (precio == 0 || precio == null || precio == undefined) {
            return res.status(404).json({ message: 'El precio no puede ser cero.' });
        }

        const imagen = req.file ? req.file.filename : undefined;

        if (!imagen) {
            return res.status(404).json({ message: 'Campos vacíos' });
        }

        const newProduct = new Product({ nombre, descripcion, precio, categoria, imagen });
        await newProduct.save();
        res.json({ message: 'Producto creado' });
    } catch (err) {
        res.status(500).send(err);
    }
};

/* Actualizar un producto existente */
adminProduCtrl.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoria } = req.body;

        if (!id) {
            return res.status(404).json({ message: 'Campos vacíos' });
        }

        if (!nombre || !descripcion || !precio || !categoria) {
            return res.status(404).json({ message: 'Campos vacíos' });
        }

        if (nombre.trim || descripcion.trim || precio.trim || categoria.trim) {
            return res.status(404).json({ message: 'Las descripciones no deben tener espacios en blanco' });
        }

        if (precio == 0) {
            return res.status(404).json({ message: 'El precio no puede ser cero.' });
        }

        const updateData = { nombre, descripcion, precio, categoria };
        if (req.file) {
            updateData.imagen = req.file ? req.file.filename : undefined;
        }
        await Product.findByIdAndUpdate(id, updateData);
        res.json({ message: 'Producto actualizado' });
    } catch (err) {
        res.status(500).send(err);
    }
};

/* Eliminar un producto */
adminProduCtrl.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'Campos vacíos' });
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = adminProduCtrl;
