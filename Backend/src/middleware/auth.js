const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const checkTokenAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ error: 'No tienes autorización' });
    }

    const token = authHeader;

    try {
        const payload = jwt.verify(token, process.env.SECRET);

        // Verificar si el payload tiene el rol de 'Administrador'
        if (payload.role !== 'Administrador') {
            return res.status(403).json({ error: 'No tienes autorización' });
        }

        req.user = payload; // Attach the payload to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'El token no es correcto' });
    }
};

const checkTokenUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ error: 'No tienes autorización' });
    }

    const token = authHeader;

    try {
        const payload = jwt.verify(token, process.env.SECRET);

        // Verificar si el payload tiene el rol de 'Administrador'
        if (payload.role !== 'Cliente') {
            return res.status(403).json({ error: 'No tienes autorización' });
        }

        req.user = payload; // Attach the payload to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'El token no es correcto' });
    }
};

module.exports = { checkTokenAdmin, checkTokenUser };
