const express = require('express');
const handlebar = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

require('./dsl/connectDB');


const homeRouter = require('./routes/home');
const shopRouter = require('./routes/shop');
const userRoute = require('./routes/user');
require('./dsl/connectDB')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('view engine', 'hbs');

app.engine('hbs', handlebar({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: 'index',
}));

app.use(express.static(path.join('public')));

app.use('/home', homeRouter);
app.use('/shop', shopRouter);
app.use('/', userRoute);

module.exports = app;