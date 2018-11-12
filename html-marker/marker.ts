import * as parse5 from "parse5";
import * as fs from "fs";
import { markupNodes } from "./markupNodes";
import { IdGenerator } from "./idGenerator";
import { DefaultTreeNode } from "parse5";
// @ts-ignore
import glob from "glob-fs";
// @ts-ignore
import * as windows1251  from 'windows-1251'

var files = glob().readdirSync(process.argv[2], {});

for (let htmlFile of files) {
  if (fs.existsSync(htmlFile)) {
    fs.readFile(htmlFile, (err: any, data: Buffer) => {
      let srcHtml = windows1251.decode(data.toString('binary'));

      let document = parse5.parse(srcHtml);

      let generator = new IdGenerator();
      markupNodes(document as DefaultTreeNode, generator);

      let outputFile = process.argv[3];
      if (!outputFile) {
        outputFile = htmlFile.replace(".html", ".marked.html");
      }
      let outputStr = parse5.serialize(document);
      let output = windows1251.encode(outputStr);
      fs.writeFile(outputFile, output, () => {
        console.info("Markup complete! Output has been written to " + outputFile);
      });
      
    });
  } else {
    throw new Error("File not exists or not sepcified.");
  }
}
