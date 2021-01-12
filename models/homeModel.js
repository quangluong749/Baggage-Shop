const { db } = require('../dsl/connectDB');

exports.bannerImg = async () => {
    const banner = db().collection("banner")
    const imgs = await banner.find({}).toArray();
    const bannerImgs = (() => {
        var result = {
            banner: imgs.filter(image => image.name == "banner").map(i => i.img),
            travel: imgs.filter(image => image.name == "travel").map(i => i.img),
            storeSpace1: imgs.filter(image => image.name.indexOf("storeSpace1") > -1).map(i => i.img),
            storeSpace2: imgs.filter(image => image.name.indexOf("storeSpace2") > -1).map(i => i.img),
            sale1: imgs.filter(image => image.name.indexOf("sale1") > -1).map(i => i.img),
            sale2: imgs.filter(image => image.name.indexOf("sale2") > -1).map(i => i.img),
            trending: imgs.filter(image => image.name.indexOf("trending") > -1).map((obj, index) => {
                var rObj = { key: index + 1, img: obj.img};
                return rObj;
            })
        };
        return result;
    })();

    return bannerImgs;
}
