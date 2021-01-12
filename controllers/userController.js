const userModel = require('../models/userModel')

exports.signIn = (req, res, next) => {
    res.render('signIn');
};

exports.signUp = (req, res, next) => {
    res.render('signUp');
};

exports.contact = (req, res, next) => {
    res.render('contact');
}

exports.addUser = async (req, res, next) => {
    const newUser = req.body;
    await userModel.addUser(newUser);
    res.redirect("/signIn");
}

exports.logOut = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

exports.setting = (req, res, next) => {
    
}

exports.addProduct = async (req, res, next) => {
    await userModel.addProductToCollection(req.user._id, req.params.id);
    res.redirect('/collection');
}

exports.collection = async (req, res, next) => {
    const myProducts = await userModel.showCollection(req.user._id);
    res.render('collection', {myProducts});
}