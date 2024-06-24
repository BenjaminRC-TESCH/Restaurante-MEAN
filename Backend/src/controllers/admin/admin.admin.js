const adminAdCtrl = {};
const passport = require('passport');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*USUARIOS*/
adminAdCtrl.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

adminAdCtrl.createAdmin = async (req, res) => {
    const { nombre, aPaterno, aMaterno, direccion, telefono, correo, password, rol } = req.body;

    if (!nombre || !aPaterno || !aMaterno || !direccion || !telefono || !correo || !password) {
        return res.status(400).json({ message: 'Por favor completa todos los campos.' });
    }

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

    try {
        const validateEmail = await Admin.findOne({ correo: correo });
        if (validateEmail) {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            nombre: nombre,
            aPaterno: aPaterno,
            aMaterno: aMaterno,
            direccion: direccion,
            telefono: telefono,
            correo: correo,
            password: hashedPassword,
            rol: rol,
        });

        const newAdmin = await admin.save();
        res.status(201).json({ message: 'Usuario Registrado' });
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
    }
};

adminAdCtrl.updateAdmin = async (req, res) => {
    try {
        const { nombre, aPaterno, aMaterno, direccion, telefono, correo, password, rol } = req.body;
        const { id } = req.params;

        if (!nombre || !aPaterno || !aMaterno || !direccion || !telefono || !correo || !rol) {
            return res.status(400).json({ message: 'Por favor completa todos los campos.' });
        }

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

        // Crear objeto de actualización del administrador
        let updateAdmin = {
            nombre,
            aPaterno,
            aMaterno,
            direccion,
            telefono,
            correo,
            rol,
        };

        // Si la contraseña está presente y cumple con los requisitos, encriptarla
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateAdmin.password = hashedPassword;
        }

        // Actualizar el administrador en la base de datos
        const admin = await Admin.findByIdAndUpdate(id, updateAdmin, { new: true });

        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        // Enviar la respuesta con el administrador actualizado
        res.status(200).json({ message: 'Administrador actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el administrador' });
    }
};

adminAdCtrl.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json(`Usuario con _id ${id} no encontrado`);
        }

        // Utilizamos deleteOne en lugar de remove
        const result = await Admin.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json(`Usuario con _id ${id} no encontrado`);
        }

        res.status(200).json({ message: `Usuario con _id ${id} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = adminAdCtrl;
