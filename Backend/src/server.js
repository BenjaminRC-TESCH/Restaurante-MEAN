const express = require('express');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');

const app = express();

require('./config/passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: 'http://localhost:4200',
        methods: 'PUT, GET, POST, OPTIONS, PATCH, DELETE',
        allowedHeaders: 'Content-Type,Authorization',
    })
);

app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    next();
});

app.use(express.json());
app.set('port', process.env.PORT || 4000);

app.use('/uploads', express.static(path.resolve('uploads')));

app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/admin.routes'));
app.use('/api', require('./routes/user.routes'));

module.exports = app;
