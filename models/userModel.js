const bcrypt = require('bcrypt')
const {
    ObjectId
} = require('mongodb');

const {
    db
} = require('../dsl/connectDB');
const shopModel = require('./shopModel');

const nameCollection = "users";
const nameCollectionToken = "tokens";
var mongoose = require("mongoose");

var schemaUser = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        default: null
    },
    avatar: {
        type: String,
        default: ""
    },
    permission: {
        type: Number,
        default: 1
    },
    _collection: {
        type: Array,
        default: []
    },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date
});

const schemaToken = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: nameCollection
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

const User = mongoose.model(nameCollection, schemaUser);
const Token = mongoose.model(nameCollectionToken, schemaToken);

exports.addUser = async (newUser) => {
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            const user = new User({
                avatar: '/images/users/default.png',
                username: newUser.username,
                password: hash,
                email: newUser.email,
                phone: newUser.phone,
            });

            return await db().collection(nameCollection).insertOne(user);
        })
    });
}

exports.checkCredential = async (username, password) => {
    const user = await db().collection(nameCollection).findOne({
        username: username
    });
    if (!user)
        return false;
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword)
        return user;
    return false;
}

exports.getUser = (id) => db().collection(nameCollection).findOne({
    _id: ObjectId(id)
});
exports.getUserByEmail = (email) => db().collection(nameCollection).findOne({
    email: email
});

exports.addProductToCollection = async (userId, id) => {
    const user = await this.getUser(userId);
    for (var i = 0; i < user.collection.length; i++)
        if (user.collection[i] == id)
            return;
    await db().collection(nameCollection).updateOne({
        _id: ObjectId(userId)
    }, {
        $push: {
            collection: ObjectId(id)
        }
    })
}

exports.showCollection = async (userId) => {
    const user = await this.getUser(userId);
    if (!user.collection)
        return;
    var myProducts = [];
    for (var i = 0; i < user.collection.length; i++) {
        var product = await db().collection("products").findOne({
            _id: ObjectId(user.collection[i])
        });
        myProducts.push(product);
    }
    return myProducts;
}

exports.updateProfile = (userId, newProfile) => {
    return db().collection("users").updateOne( { _id: ObjectId(userId) }, { $set: {
        avatar: newProfile.avatar,
        email: newProfile.email,
        phone: newProfile.phone
    } } ) 
}
