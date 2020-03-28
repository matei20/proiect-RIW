const buildIndexes = require("./build-indexes");

const inputPath = './files/input';
const directIndexPath = './files/output/index-direct.json';
const indirectIndexPath = './files/output/index-indirect.json';

buildIndexes(inputPath, directIndexPath, indirectIndexPath);


