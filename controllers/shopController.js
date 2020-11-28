const shopModel = require('../models/shopModel')

exports.products = async (req, res, next) => {
    const products = await shopModel.products();
    console.dir(products);
    res.render('shop', {products});
};

exports.details = () => {
    
}