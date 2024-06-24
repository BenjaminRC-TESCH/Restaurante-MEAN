const adminRolCtrl = {};
const passport = require('passport');
const Rol = require('../../models/rols');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*ROLES*/
adminRolCtrl.getAllRols = async (req, res) => {
    try {
        const rols = await Rol.find();
        res.status(200).json(rols);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

adminRolCtrl.createRol = async (req, res) => {
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
        const validateRol = await Rol.findOne({ nombre: nombre });
        if (validateRol) {
            return res.status(409).json({ message: 'El nombre del Rol ya está en uso.' });
        }

        const rol = new Rol({
            nombre: nombre,
        });

        const newRol = await rol.save();
        res.status(201).json({ message: 'Rol Registrado' });
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
    }
};

adminRolCtrl.updateRol = async (req, res) => {
    try {
        const { nombre } = req.body;
        const { id } = req.params;

        if (!nombre || !id) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        // Crear objeto de actualización del administrador
        let updateRol = {
            nombre,
        };

        // Actualizar el administrador en la base de datos
        const rol = await Rol.findByIdAndUpdate(id, updateRol, { new: true });

        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        // Enviar la respuesta con el administrador actualizado
        res.status(200).json({ message: 'Rol actualizada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la Rol:' });
    }
};

adminRolCtrl.deleteRol = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

        // Utilizamos deleteOne en lugar de remove
        const result = await Rol.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `Rol con _id ${id} no encontrado` });
        }

        res.status(200).json({ message: `Rol con _id ${id} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = adminRolCtrl;
