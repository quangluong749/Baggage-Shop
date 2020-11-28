const express = require('express');
const handlebar = require('express-handlebars');
require('./dsl/connectDB')
const homeRouter = require('./routes/home');
const shopRouter = require('./routes/shop');
const userRoute = require('./routes/user');
const app = express();




// view engine setup
app.set('view engine', 'hbs');

app.engine('hbs', handlebar({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: 'index',
}));

app.use(express.static('public'));

app.use('/home', homeRouter);
app.use('/shop', shopRouter);
app.use('/user', userRoute);

module.exports = app;