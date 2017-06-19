"use strict";

require('babel-polyfill');

const fs = require('fs');
const path = require('path');

/**
 * Generate content by template
 */
function template(tpl, contents) {
    let result = tpl;
    for(let name in contents) {
        result = result.replace(new RegExp(`#{${name}}`, 'gm'), contents[name]);
    }
    return result;
}


let tpl = fs.readFileSync("index.html.tpl", "utf-8");
const htmlFiles = fs.readdirSync(__dirname).filter(fileName => fileName.endsWith(".html"));
const fragment = htmlFiles.map(f => `<li class="list-group-item"><a href="${f}">${f.substring(0, f.length - 5)}</a></li>`).join("");
const indexHtml = template(tpl, {examples: fragment});
fs.writeFileSync("index.html", indexHtml);
