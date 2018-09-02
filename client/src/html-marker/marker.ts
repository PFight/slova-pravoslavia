import * as parse5 from "parse5";
import * as fs from "fs";
import { markupNodes } from "./markupNodes";
import { IdGenerator } from "./idGenerator";
import { DefaultTreeNode } from "parse5";

let htmlFile = process.argv[2];
if (fs.existsSync(htmlFile)) {
  let srcHtml = fs.readFileSync(htmlFile, "utf-8");
  let document = parse5.parse(srcHtml);

  let generator = new IdGenerator();
  markupNodes(document as DefaultTreeNode, generator);

  let outputFile = process.argv[3];
  if (!outputFile) {
    outputFile = htmlFile.replace(".html", ".marked.html");
  }
  let output = parse5.serialize(document);
  fs.writeFileSync(outputFile, output, { encoding: "utf-8" });
  console.info("Markup complete! Output has been written to " + outputFile);
} else {
  throw new Error("File not exists or not sepcified.");
}
