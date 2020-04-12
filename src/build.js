const db = require("./db");

async function main() {
    await db.clear();
    const buildIndexes = require("./build-indexes");

    const inputPath = 'static/';
    await buildIndexes(inputPath);

}

db.connect().then(main).then(db.close);
