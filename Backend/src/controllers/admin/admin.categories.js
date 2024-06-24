const adminCateCtrl = {};
const passport = require('passport');
const Categorie = require('../../models/categories');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*CATEGORIAS*/
adminCateCtrl.getAllCategories = async (req, res) => {
    try {
        const admins = await Categorie.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

adminCateCtrl.createCategories = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'Por favor completa todos los campos.' });
    }

    // Expresión regular para validar que el nombre y apellidos contengan solo letras
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(nombre)) {
        return res.status(400).json({ message: 'Por favor ingresa un nombre válido.' });
    }

    try {
        const validateCategorie = await Categorie.findOne({ nombre: nombre });
        if (validateCategorie) {
            return res.status(409).json({ message: 'El nombre de la categoria ya está en uso.' });
        }

        const categorie = new Categorie({
            nombre: nombre,
        });

        const newAdmin = await categorie.save();
        res.status(201).json({ message: 'Categoria Registrado' });
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
    }
};

adminCateCtrl.updateCategories = async (req, res) => {
    try {
        const { nombre } = req.body;
        const { id } = req.params;

        if (!nombre || !id) {
            return res.status(404).json({ message: 'Parametros vacíos' });
        }

        // Crear objeto de actualización del administrador
        let updateCategorie = {
            nombre,
        };

        // Actualizar el administrador en la base de datos
        const categorie = await Categorie.findByIdAndUpdate(id, updateCategorie, { new: true });

        if (!categorie) {
            return res.status(404).json({ message: 'Categoria no encontrado' });
        }

        // Enviar la respuesta con el administrador actualizado
        res.status(200).json({ message: 'Categoria actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la Categoria:' });
    }
};

adminCateCtrl.deleteCategories = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: `Categoria con _id ${id} no encontrado` });
        }

        // Utilizamos deleteOne en lugar de remove
        const result = await Categorie.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Categoria con _id ${id} no encontrado` });
        }

        res.status(200).json({ message: `Categoria con _id ${id} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = adminCateCtrl;
