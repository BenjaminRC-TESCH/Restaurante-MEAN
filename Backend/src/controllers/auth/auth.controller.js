const authCtrl = {};
const passport = require('passport');
const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const EMAIL = process.env.EMAIL;
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL;

const getTemplate = (nombre, aPaterno, aMaterno, code) => {
    return `
                <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verificación de Cuenta</title>
                <style>
                    /* Estilos CSS */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }

                    #email-content {
                        padding: 20px;
                        background-color: #f9f9f9;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        max-width: 600px;
                        margin: 20px auto;
                    }

                    h2 {
                        color: #333;
                    }

                    p {
                        margin-bottom: 15px;
                    }

                    a {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }

                    a:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>

            <body>

                <div id="email-content">
                    <h2>Hola ${nombre} ${aPaterno} ${aMaterno}</h2>
                    <p>Al iniciar por primera vez sesión, se te pedirá el código de verificación para poder validar tu cuenta.</p>
                    <p>Tu código para verificar tu cuenta es el siguiente:</p>
                    <p>${code}</p>
                </div>

            </body>
            `;
};

authCtrl.signupUser = async (req, res) => {
    const { nombre, aPaterno, aMaterno, direccion, telefono, correo, password, confirmPassword } = req.body;

    if (!nombre || !aPaterno || !aMaterno || !direccion || !telefono || !correo || !password) {
        return res.status(400).json({ message: 'Por favor completa todos los campos.' });
    }

    if (nombre.trim || aPaterno.trim || aMaterno.trim || direccion.trim || telefono.trim || correo.trim || password.trim) {
        return res.status(400).json({ message: 'No puedes dejar espacios en blanco.' });
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

    //Match de las contraseñas
    if (confirmPassword != password) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    try {
        const validateEmail = await User.findOne({ correo: correo });
        if (validateEmail) {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const code = Math.floor(10000000 + Math.random() * 90000000);

        const newUser = new User({
            nombre: nombre,
            aPaterno: aPaterno,
            aMaterno: aMaterno,
            direccion: direccion,
            telefono: telefono,
            correo: correo,
            password: hashedPassword,
            code: code,
        });

        // Configuración del transporte para nodemailer (ajustar según tu proveedor de correo)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD_EMAIL,
            },
        });

        // Contenido del correo electrónico
        const mailOptions = {
            from: EMAIL,
            to: correo,
            subject: 'Código de verificación',
            html: getTemplate(nombre, aPaterno, aMaterno, code),
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        await newUser.save();

        const token = jwt.sign({ _id: newUser._id }, process.env.SECRET);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

//Login para administrativos y estudiantes
authCtrl.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Verificación de campos vacíos
    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos' });
    }

    passport.authenticate('local', async (err, userObject, info) => {
        try {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (!userObject) {
                return res.status(401).json({ message: info.message });
            }

            let token;
            if (userObject.user) {
                token = userObject.token;
                return res.status(200).json({ success: true, token, redirect: '/productos' });
            }

            const foundUser = userObject;
            token = userObject.token;

            if (foundUser.rol.includes('Administrador')) {
                return res.status(200).json({ success: true, token, redirect: '/admin-administrators' });
            } else {
                return res.status(200).json({ redirect: '**' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error del servidor' });
        }
    })(req, res);
};

//Metodo para verificar cuenta de estudiantes
authCtrl.verifiedCode = async (req, res) => {
    try {
        const { codigoVerificacion, email } = req.body;

        if (!codigoVerificacion) {
            return res.status(400).json({ message: 'Por favor, ingresa tu código de verificación y tu correo electrónico.' });
        }

        const foundUser = await User.findOne({ correo: email });

        if (!foundUser) {
            return res.status(401).json({ message: 'Algo salió mal.' });
        } else {
            const foundCode = await User.findOne({ code: codigoVerificacion });

            if (!foundCode) {
                return res.status(401).json({ message: 'Código erróneo. Ingresa el código correctamente.' });
            } else {
                await User.findOneAndUpdate({ correo: email }, { $set: { status: 'VERIFIED' } });

                return res.status(200).json({
                    success: true,
                    message: 'Código verificado correctamente. Tu cuenta ha sido verificada.',
                });
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'Error del servidor' });
    }
};

module.exports = authCtrl;
