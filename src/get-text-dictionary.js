const fs = require('fs');
const stopWordsJson = fs.readFileSync('./stop-words.json');
const stopWords = JSON.parse(stopWordsJson);
const snowball = require('node-snowball');

//snowball.stemword(['consignment', 'conspiring'], 'english');

const getTextDictionary = (docText) => {
    return docText
        .match(/[\wăâîșț]+/gi)
        .map(w => w.toLowerCase())
        .map(w => snowball.stemword(w, "romanian"))
        .filter(w => !stopWords.includes(w))
        .reduce((acc, w) => {
            acc[w] = acc[w] === undefined ? 1 : acc[w] + 1;
            return acc;
        }, {});
};

module.exports = getTextDictionary;