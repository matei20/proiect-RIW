const { MongoClient } = require("mongodb");

const kDbUrl = "mongodb://localhost:27017/riw";
const kDbName = "riw";
const kDirectIndexCollection = "directIndex";
const kIndirectIndexCollection = "indirectIndex";

class Db {
    constructor() {
        this.db = null;
        this.client = null;

        this.connect = this.connect.bind(this);
        this.close = this.close.bind(this);
    }

    async connect() {
        this.client = await MongoClient.connect(kDbUrl, {
            useUnifiedTopology: true,
        });
        this.db = this.client.db(kDbName);
    }

    async close() {
        await this.client.close();
        this.db = null;
        this.client = null;
    }

    clear() {
        const clearDirectIndexPromise = this.db
            .collection(kDirectIndexCollection)
            .deleteMany({});
        const clearIndirectIndexPromise = this.db
            .collection(kIndirectIndexCollection)
            .deleteMany({});

        return Promise.all([clearDirectIndexPromise, clearIndirectIndexPromise]);
    }

    searchIndirectIndex(terms) {

        return this.db
            .collection(kIndirectIndexCollection)
            .aggregate([
                { $match: { $text: { $search: terms } } },
                { $unwind: "$docs" },
                { $group: { _id: "$docs.d", count: { $sum: "$docs.c" } } },
                { $project: { _id: 0, link: "$_id", count: "$count" } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ])
            .toArray();

    }
    insertDirectIndexes(directIndexDocs) {
        return this.db.collection(kDirectIndexCollection).insertMany(directIndexDocs);
    }

    insertIndirectIndexes(indirectIndexDocs) {
        return this.db.collection(kIndirectIndexCollection).insertMany(indirectIndexDocs);
    }
}

module.exports = new Db();