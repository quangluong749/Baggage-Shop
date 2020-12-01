const { db } = require('../dsl/connectDB');
const { ObjectId } = require('mongodb');


exports.products = async () => {
    const collection = db().collection("Baggages");
    const products = await collection.find({ imgType: "product" }).toArray();
    const result = {
        row1: products.filter((product, index) => index < 4),
        row2: products.filter((product, index) => index >= 4)
        };   
    return result;
}

exports.detail = async (id) => {
    const collection = db().collection("Baggages");
    const product = await collection.findOne({ _id: ObjectId(id) });
    return product;
}