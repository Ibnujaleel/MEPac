const fs = require('fs');

let dataStr = fs.readFileSync('figma_design_utf8.json', 'utf8');
if (dataStr.charCodeAt(0) === 0xFEFF) {
    dataStr = dataStr.slice(1);
}
const data = JSON.parse(dataStr);

function extractText(node, depth = 0) {
    let result = '';
    const indent = '  '.repeat(depth);
    
    if (node.type === 'TEXT') {
        result += `${indent}- TEXT: "${node.characters}"\n`;
    } else if (node.name) {
        result += `${indent}[${node.type}] ${node.name}\n`;
    }

    if (node.children) {
        for (const child of node.children) {
            result += extractText(child, depth + 1);
        }
    }
    return result;
}

const rootNode = data.nodes['0:1'].document;
const summary = extractText(rootNode);

fs.writeFileSync('figma_summary.txt', summary, 'utf8');
console.log('Summary created.');
