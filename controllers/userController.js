const crypto = require('crypto');
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel')
const uploadFile = require('../models/services/uploadFile');




exports.signIn = (req, res, next) => {
    let notification = "";
    if (req.query.notification === "1") {
        notification = 'Your account is not verified!';
    }
    if (req.query.notification === "2") {
        notification = 'The account has been verified.';
    }
    res.render('signIn',{
        notification
    });
};

exports.signUp = (req, res, next) => {
    res.render('signUp');
};

exports.contact = (req, res, next) => {
    res.render('contact');
}

// Sign Up --
exports.addUser = async function (req, res) {
    //console.log(req.body.email);
    const user = await userModel.findOneByEmail(req.body.email);
    //console.log(user);
    // Make sure user doesn't already exist
    if (user) return res.status(400).render('signUp',{
        notification: "The email address you have entered is already associated with another account. Please register another one!"
    });
    // Create and save the user
    //user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
    const password_hash = bcrypt.hashSync(req.body.password, 8);
    const entity = {
        username: req.body.username,
        password_hash,
        email: req.body.email,
        phone: req.body.phone
    }
    console.log(entity);
    await userModel.addOne(entity);
    const newUser = await userModel.findOneByEmail(req.body.email)
    const entityToken = {
        _userId: newUser._id,
        token: crypto.randomBytes(16).toString('hex')
    }
    await userModel.addOneToken(entityToken)
    //console.log(newUser.email);
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        secure: false, // use SSL
        port: 25, // port for secure SMTP
        auth: {
            user: 'baggageshopvn@gmail.com',
            pass: 'MSSV_18120433'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: 'baggageshopvn@gmail.com',
        to: newUser.email,
        subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/account/confirmation\/' + entityToken.token + '.\n'
    };
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            //console.log("done 3");
            return res.status(500).send({
                msg: err.message
            });
        }
        //console.log("done 4"); F
        res.status(200).render('signIn',{
            notification: 'A verification email has been sent to ' + newUser.email + '. Please confirm to go on login!',
        });
    });
}
exports.verifyAccount = async function (req, res) {
    const tokenQuery = req.params.tokenQuery;

    // Find a matching token
    const token = await userModel.getOneToken(tokenQuery);

    if (!token) return res.status(400).render('signUp',{
        notification: "We were unable to find a valid token. Your token my have expired."
    });
    // If we found a token, find a matching user
    const user = await userModel.findOneByFilter({
        _id: token._userId
    })
    if (!user) return res.status(400).render('signUp',{
        notification: "We were unable to find a user for this token. Please register again!"
    });
    if (user.isVerified) return res.status(400).render('signIn',{
        notification: "This user has already been verified.",
    });
    // Verify and save the user
    await userModel.verifyOK(user._id);
    user.isVerified = true;
    res.status(200).redirect(`/signin?notification=2`);
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
