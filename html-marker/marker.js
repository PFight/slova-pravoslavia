"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parse5 = tslib_1.__importStar(require("parse5"));
const fs = tslib_1.__importStar(require("fs"));
const markupNodes_1 = require("./markupNodes");
const idGenerator_1 = require("./idGenerator");
let htmlFile = process.argv[2];
if (fs.existsSync(htmlFile)) {
    let srcHtml = fs.readFileSync(htmlFile, "utf-8");
    let document = parse5.parse(srcHtml);
    let generator = new idGenerator_1.IdGenerator();
    markupNodes_1.markupNodes(document, generator);
    let outputFile = process.argv[3];
    if (!outputFile) {
        outputFile = htmlFile.replace(".html", ".marked.html");
    }
    let output = parse5.serialize(document);
    fs.writeFileSync(outputFile, output, { encoding: "utf-8" });
    console.info("Markup complete! Output has been written to " + outputFile);
}
else {
    throw new Error("File not exists or not sepcified.");
}
