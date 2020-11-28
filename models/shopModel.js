const connectDB = require('../dsl/connectDB');

exports.products = async () => {
    const collection = await connectDB.db().collection("Baggages");
    const products = await collection.find({ imgType: "product"}).toArray();
    const result = {
        row1: products.filter((product, index) => index < 4),
        row2: products.filter((product, index) => index >= 4)
        };   
    return result;
}