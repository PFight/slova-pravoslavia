"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parse5 = tslib_1.__importStar(require("parse5"));
const fs = tslib_1.__importStar(require("fs"));
const markupNodes_1 = require("./markupNodes");
const idGenerator_1 = require("./idGenerator");
// @ts-ignore
const glob_fs_1 = tslib_1.__importDefault(require("glob-fs"));
// @ts-ignore
const windows1251 = tslib_1.__importStar(require("windows-1251"));
var files = glob_fs_1.default().readdirSync(process.argv[2], {});
for (let htmlFile of files) {
    if (fs.existsSync(htmlFile)) {
        fs.readFile(htmlFile, (err, data) => {
            let srcHtml = windows1251.decode(data.toString('binary'));
            let document = parse5.parse(srcHtml);
            let generator = new idGenerator_1.IdGenerator();
            markupNodes_1.markupNodes(document, generator);
            let outputFile = process.argv[3];
            if (!outputFile) {
                outputFile = htmlFile.replace(".html", ".marked.html");
            }
            let outputStr = parse5.serialize(document);
            outputStr = outputStr.replace('charset=windows-1251', 'charset=utf-8');
            fs.writeFileSync(outputFile, outputStr, { encoding: 'utf-8'});
            console.info("File markup complete! Output has been written to " + outputFile);            
        });
    }
    else {
        throw new Error("File not exists or not sepcified.");
    }
}
