const express = require("express");
const app = express();
const db = require("./db");
const getTextDictionary = require("./get-text-dictionary");
//const path = require("path");

app.use("/static", express.static("static"));
app.use(express.static("public"));

app.get("/search/:text", async (req, res) => {
    const { text } = req.params;

    const textDictionary = getTextDictionary(text);
    const result = await db.searchIndirectIndex(Object.keys(textDictionary).join(" "));
    res.send(JSON.stringify(result));
});

const KPort = 3000;
db.connect().then(() =>
    app.listen(KPort, () => console.log(`app listening on port ${KPort}`))
);