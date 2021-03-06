const { ObjectId } = require('mongodb');
const mongoPaging = require('mongo-cursor-pagination')

const { db } = require('../dsl/connectDB');

exports.detail = async (id) => {
    const collection = db().collection("products");
    console.log(id);
    const product = await collection.findOne({ _id: ObjectId(id) });
    const relatedProd = await collection.find( { _id: {$ne: ObjectId(product._id)}, category: product.category }).limit(4).toArray();
    return { product, relatedProd };
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
    console.log(searchStr);
    const collection = db().collection("products");
    await collection.ensureIndex( {
        imgName: "text"
    });
    const searchProd = await mongoPaging.search(collection, searchStr, { 
        limit: 4,
        fields: {
            imgDir: true,
            imgName: true, 
            price: true,
            salePrice: true
        },
        next: nextPage? nextPage : undefined
    });
    console.log(searchProd); 
    if (searchProd.next) { 
        const nextSearch = mongoPaging.search(collection, searchStr, { 
            limit: 8,
            next: searchProd.next
        });
        if (nextSearch.results) { 
            searchProd.hasNext = true;
            searchProd.searchStr = searchStr;
        }
    }
    
    return searchProd;
}

exports.filter = async (category, prevPage, nextPage) => {
    const filterProd = await mongoPaging.find(db().collection("products"), {
        query: {
            category: category
        },
        limit: 8,
        sortAscending: true,
        next: nextPage? nextPage : undefined,
        previous: prevPage? prevPage : undefined
    });
    if (filterProd.hasNext || filterProd.hasPrevious){
        filterProd.category = category;
    }

    return filterProd;
}
