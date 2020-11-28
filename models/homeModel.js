const connectDB = require('../dsl/connectDB');

exports.bannerImg = async () => {
    const collection = await connectDB.db().collection("Baggages")
    const imgs = await collection.find({ imgType: "banner" }).toArray();
    const bannerImgs = (() => {
        var result = {
            banner: imgs.filter(img => img.imgName == "banner").map(i => i.imgDir),
            travel: imgs.filter(img => img.imgName == "travel").map(i => i.imgDir),
            storeSpace1: imgs.filter(img => img.imgName.indexOf("storeSpace1") > -1).map(i => i.imgDir),
            storeSpace2: imgs.filter(img => img.imgName.indexOf("storeSpace2") > -1).map(i => i.imgDir),
            sale1: imgs.filter(img => img.imgName.indexOf("sale1") > -1).map(i => i.imgDir),
            sale2: imgs.filter(img => img.imgName.indexOf("sale2") > -1).map(i => i.imgDir),
            trending: imgs.filter(img => img.imgName.indexOf("trending") > -1).map((obj, index) => {
                var rObj = { key: index + 1, imgDir: obj.imgDir};
                return rObj;
            })
        };
        return result;
    })();

    return bannerImgs;
}
