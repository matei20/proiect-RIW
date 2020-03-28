const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const getDocumentText = require('./get-document-text');
const getTextDictionary = require('./get-text-dictionary');

function buildDirectIndex(inputPath) {
    const queue = [''];
    const directIndex = [];
    function readDir() {
        queue.forEach(queuedPath => {
            fs.readdirSync(path.join(inputPath, queuedPath)).forEach(item => {
                const readPath = path.join(inputPath, queuedPath, item);
                const itemStats = fs.statSync(readPath);
                //const relPath = path.join(queuedPath,item); //pentru cale doar incepand cu directorul input

                if (itemStats.isDirectory()) {
                    //fs.mkdirSync(path.join(directIndexPath, queuedPath, item));
                    return queue.push(path.join(queuedPath, item));
                }

                const htmlAsString = fs.readFileSync(readPath);
                const $doc = cheerio.load(htmlAsString);
                const documentText = getDocumentText($doc);
                const textDictionary = getTextDictionary(documentText);

                //const filePath = relPath.replace(/\\/g,"/"); //pentru cale doar incepand cu directorul input
                const filePath = readPath.replace(/\\/g, "/");
                directIndex.push({ doc: filePath, terms: textDictionary });

            });
        });
    }

    while (queue.length > 0) {
        readDir();
        queue.shift();
    }
    //fs.writeFileSync(directIndexPath, JSON.stringify(directIndex, null, 4));
    return directIndex;
}
function buildIndirectIndex(directIndexDoc) {
    const indirectIndex = {};

    directIndexDoc.forEach(d => {
        Object.keys(d.terms).forEach(t => {
            if (indirectIndex[t] === undefined)
                indirectIndex[t] = {};
            indirectIndex[t][d.doc] = d.terms[t];
        });
    });
    return Object.keys(indirectIndex).map( key => ({term: key, docs: indirectIndex[key] }));
}
const buildIndexes = (inputPath, directIndexPath, indirectIndexPath) => {
    const directIndex = buildDirectIndex(inputPath);
    const indirectIndex = buildIndirectIndex(directIndex);
    fs.writeFileSync(directIndexPath, JSON.stringify(directIndex, null, 4));
    fs.writeFileSync(indirectIndexPath, JSON.stringify(indirectIndex, null, 4));
};
module.exports = buildIndexes;