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

exports.search = async (searchStr, nextPage) => {
    const collection = db().collection("products");
    await collection.ensureIndex( {
        imgName: "text"
    });
    const searchProd = await mongoPaging.search(collection, searchStr, { 
        limit: 1,
        fields: {
            imgDir: true,
            imgName: true, 
            price: true,
            salePrice: true
        },
        next: nextPage? nextPage : undefined
    });
    if (searchProd.next) { 
        searchProd.hasNext = true;
        searchProd.searchStr = searchStr;
    }
    console.log(searchProd);

    return searchProd;
}

exports.filter = async () => {
    
}