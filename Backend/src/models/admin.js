const { Schema, model } = require('mongoose');
const bycrypt = require('bcrypt');

const AdminSchema = new Schema(
    {
        nombre: { type: String, required: true },
        aPaterno: { type: String, required: true },
        aMaterno: { type: String, required: true },
        direccion: { type: String, required: true },
        telefono: { type: String, required: true },
        correo: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        rol: { type: String, required: true },
    },
    {
        timestams: true,
    }
);

AdminSchema.methods.encryptPasswords = async (password) => {
    const salt = await bycrypt.genSalt(10);
    return await bycrypt.hash(password, salt);
};

AdminSchema.methods.matchPassword = async function (password) {
    return await bycrypt.compare(password, this.password);
};

module.exports = model('Admin', AdminSchema);
