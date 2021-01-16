const userModel = require('../models/userModel')
const uploadFile = require('../models/services/uploadFile');

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

// -- Sign Up.
exports.logOut = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

exports.setting = (req, res, next) => {
    res.render('setting');
}

exports.addProduct = async (req, res, next) => {
    await userModel.addProductToCollection(req.user._id, req.params.id);
    res.redirect('/collection');
}

exports.collection = async (req, res, next) => {
    const myProducts = await userModel.showCollection(req.user._id);
    res.render('collection', {myProducts});
}

exports.updateProfile = (req, res, next) => {
    uploadFile(req, res, async (error) => {
        if (error) {
          return res.render('setting', {msgError: error});
        }
        const newProfile = {
            avatar: '/images/users/' + req.file.filename,
            email: req.body.email,
            phone: req.body.phone
        }
        await userModel.updateProfile(req.user._id, newProfile);
        res.redirect('/shop');
      });
}

exports.delProduct = async (req, res, next) => {
  await userModel.deleteProduct(req.user._id, req.query.id);
  res.redirect('/collection');
};
