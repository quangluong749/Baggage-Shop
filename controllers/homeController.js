const homeModel = require('../models/homeModel');

exports.index = async (req, res, next) => {
    const bannerImgs = await homeModel.bannerImg();
    res.render('home', {haveBanner: true, bannerImgs});
};


