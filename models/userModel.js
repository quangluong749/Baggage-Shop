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
module.exports = {
    ObjectId,
    all: async () => {
        const proCollection = db().collection(nameCollection);
        const list = await proCollection.find({}).toArray();
        //console.dir(list);
        return list;
    },
    addOne: async (entity) => {
        //console.log("---" +_id);
        var newUser = new User({
            username: entity.username,
            password: entity.password_hash,
            email: entity.email,
            phone: entity.phone,
        });
        //console.log(newPro);
        const userCollection = db().collection(nameCollection);
        return await userCollection.insertOne(newUser);
    },
    addOneToken: async (entity) => {
        //console.log("---" +_id);
        var newToken = new Token({
            _userId: entity._userId,
            token: entity.token
        });
        //console.log(newPro);
        const tokenCollection = db().collection(nameCollectionToken);
        return await tokenCollection.insertOne(newToken);
    },
    getOne: async (id) => {
        const userCollection = db().collection(nameCollection);
        const one = await userCollection.findOne({
            _id: ObjectId(id)
        })
        return one;
    },
    getOneToken: async (token) => {
        const tokenCollection = db().collection(nameCollectionToken);
        const one = await tokenCollection.findOne({
            token: token
        })
        return one;
    },
    findByUsername: async (username) => {
        const userCollection = db().collection(nameCollection);
        const rows = await userCollection.findOne({
            username: username
        })
        if (rows == null) {
            return null;
        }
        return rows;
    },
    findOneByEmail: async (email) => {
        const userCollection = db().collection(nameCollection);
        const rows = await userCollection.findOne({
            email: email
        })
        if (rows == null) {
            return null;
        }
        return rows;
    },
    findOneByFilter: async (filter) => {
        const userCollection = db().collection(nameCollection);
        const rows = await userCollection.findOne(filter)
        if (rows == null) {
            return null;
        }
        return rows;
    },
    verifyOK: async (_id) => {
        const userCollection = db().collection(nameCollection);
        return await userCollection.updateOne({
            "_id": ObjectId(_id)
        }, {
            $set: {
                "isVerified": true
            }
        });
    },
    patchOne: async (_id, entity, avatar) => {
        const userCollection = db().collection(nameCollection);
        //console.log(_id);
        return await userCollection.updateOne({
            "_id": ObjectId(_id)
        }, {
            $set: {
                "username": entity.username,
                //"password_hash": entity.password_hash,
                "email": entity.email,
                "avatar": avatar,
                "dob": entity.dob,
                "phone": entity.phone
                //"permission": parseInt(entity.permission)
            }
        });
    },
    delOne: async (id) => {
        const userCollection = db().collection(nameCollection);
        var result = null;
        try {
            result = await userCollection.deleteOne({
                "_id": ObjectId(id)
            });
        } catch (e) {
            console.log(e);
        }
        return result;
    },
    /**
     * Check for valid username and password. Return user info if is valid.
     * @param {*} username 
     * @param {*} password 
     */
    checkCredential1: async (email, password) => {
        const userCollection = db().collection(nameCollection);
        const user = await userCollection.findOne({
            email
        });
        if (!user) return false;
        let checkPassword = await bcrypt.compare(password, user.password_hash);
        if (checkPassword) {
            return user;
        }
        return false;
    },
    getUser1: (id) => {
        const userCollection = db().collection(nameCollection);
        const user = userCollection.findOne({
            _id: ObjectId(id)
        });
        //console.dir(user);
        return user;
    }
}