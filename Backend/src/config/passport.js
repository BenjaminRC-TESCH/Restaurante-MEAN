const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const admin = require('../models/admin');
const users = require('../models/users');
const jwt = require('jsonwebtoken');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const foundAdmin = await admin.findOne({ correo: email });

                if (!foundAdmin) {
                    const foundUser = await users.findOne({ correo: email });

                    if (!foundUser) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    } else {
                        const match = await foundUser.matchPassword(password);

                        if (!match) {
                            return done(null, false, { message: 'Contraseña incorrecta' });
                        } else {
                            if (foundUser.status === 'UNVERIFIED') {
                                return done(null, false, { message: 'Por favor, verifica tu cuenta' });
                            } else {
                                const token = jwt.sign({ _id: foundUser._id, role: foundUser.rol }, process.env.SECRET);
                                foundUser.token = token;
                                const userObject = {
                                    user: foundUser,
                                    token: token,
                                };
                                return done(null, userObject);
                            }
                        }
                    }
                } else {
                    const match = await foundAdmin.matchPassword(password);
                    if (match) {
                        const token = jwt.sign({ _id: foundAdmin._id, role: foundAdmin.rol }, process.env.SECRET);
                        foundAdmin.token = token;
                        return done(null, foundAdmin, { success: true });
                    } else {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser((id, done) => {
    admin
        .findById(id)
        .then((admin) => {
            done(null, admin);
        })
        .catch((error) => {
            done(error, null);
        });
});
