const { ObjectId } = require('mongodb');
const mongoPaging = require('mongo-cursor-pagination')

const { db } = require('../dsl/connectDB');

exports.detail = async (id) => {
    const collection = db().collection("products");
    const product = await collection.findOne({ _id: ObjectId(id) });
    return product;
}

exports.products = async (prevPage, nextPage) => {
    const products = await mongoPaging.find(db().collection("products"), {
        limit: 8,
        sortAscending: true,
        next: nextPage? nextPage : undefined,
        previous: prevPage? prevPage : undefined
    });

    return products;
}

exports.search = async (searchStr) => {
    const searchProd = await mongoPaging.search(db().collection("products"), "BAG", {
        limit: 8,
        fields: {
            imgName
        }
    });
    console.dir(searchProd);
    return searchProd;
}