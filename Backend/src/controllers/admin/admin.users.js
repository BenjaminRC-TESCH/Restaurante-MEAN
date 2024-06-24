const adminUserCtrl = {};
const passport = require('passport');
const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*USUARIOS*/
adminUserCtrl.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = adminUserCtrl;
