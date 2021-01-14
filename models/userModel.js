const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb');

const { db } = require('../dsl/connectDB');
const shopModel = require('./shopModel');

exports.addUser = async (newUser) => {
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(newUser.password, salt,  async (err, hash) => {
            const user = {
                avatar: '/images/users/default.png',
                username: newUser.username, 
                password: hash,
                email: newUser.email, 
                phone: newUser.phone,
                collection: []
            }

            await db().collection("users").insertOne(user);            
        })
    });
}

exports.checkCredential = async (username, password) => {
    const user = await db().collection("users").findOne({ username: username });
    if (!user)
        return false;
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword)
        return user;
    return false;
}

exports.getUser = (id) => db().collection("users").findOne({ _id: ObjectId(id) });

exports.addProductToCollection = async (userId, id) => {
    const user = await this.getUser(userId);
    for (var i = 0; i < user.collection.length; i++)
        if (user.collection[i] == id)
            return;
    await db().collection("users").updateOne( { _id: ObjectId(userId) }, {
        $push: { collection: ObjectId(id) }
    })
}

exports.showCollection = async (userId) => {
    const user = await this.getUser(userId);
    if (!user.collection)
        return;
    var myProducts = [];
    for(var i = 0; i < user.collection.length; i++) {
        var product = await db().collection("products").findOne({ _id: ObjectId(user.collection[i]) });
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