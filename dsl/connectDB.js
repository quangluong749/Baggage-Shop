const { MongoClient } = require('mongodb');

// Connection URI
const url = "mongodb+srv://MongoDB:Frg1EvsDIvUY1fp3@cluster0.j2mpq.mongodb.net/test";
const client = new MongoClient(url, { useUnifiedTopology: true });

let BaggageDB;

(async () => {
    await client.connect();
    BaggageDB = await client.db("BaggageDB");
    console.log("DB connected successfully!!");
})();

const db = () => BaggageDB;
module.exports = { db };
