const userModel = require('../../models/userModel');

exports.checkUsername = async (req, res, next) => {
    res.json(await userModel.isUsernameExist(req.query.username));
}
