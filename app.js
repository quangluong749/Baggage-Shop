const express = require('express');
const handlebar = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const passport = require('./passport/index');
// Call Router
const homeRouter = require('./routes/home');
const shopRouter = require('./routes/shop');
const userRoute = require('./routes/user');

// Connect to Database
require('./dsl/connectDB');


const app = express();

// view engine setup
app.set('view engine', 'hbs');

app.engine('hbs', handlebar({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: 'index',
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join('public')));
// passport middleware
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
// store req.user
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use('/home', homeRouter);
app.use('/shop', shopRouter);
app.use('/', userRoute);
module.exports = app;
