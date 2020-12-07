const shopModel = require('../models/shopModel')

exports.products = async (req, res, next) => {
    const products = await shopModel.products(req.query.prevPage, req.query.nextPage) 
    res.render('shop', {products});
};

exports.detail = async (req, res, next) => {
    const product = await shopModel.detail(req.params.id);
    console.dir(product);
    res.render('single', {product});
};

exports.search = async (req, res, next) => {
    const searchProd = await shopModel.search(req.query.searchStr, req.query.nextPage);
    
    res.render('shop', { products: searchProd });
}

exports.filter = async (req, res, next) => {
    
}