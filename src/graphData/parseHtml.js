const fs = require('fs');
const cheerio = require('cheerio');

function extractNodesFromScript(scriptContent) {
  const nodesMatch = scriptContent.match(/nodes\s*=\s*new\s+vis\.DataSet\((\[.*?\])\)/);
  if (nodesMatch) {
    const nodesData = JSON.parse(nodesMatch[1]);
    return nodesData;
  }

  return [];
}
function extractEdgesFromScript(scriptContent) {
    const nodesMatch = scriptContent.match(/edges\s*=\s*new\s+vis\.DataSet\((\[.*?\])\)/);
    if (nodesMatch) {
      const nodesData = JSON.parse(nodesMatch[1]);
      return nodesData;
    }
  
    return [];
  }

function parseHTML(filePath, extractNode) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  const nodesData = [];

  $('script').each((_index, element) => {
    const scriptContent = $(element).html();
    const extractedNodes = extractNodesFromScript(scriptContent);
    const extractedEdges = extractEdgesFromScript(scriptContent);
    if(extractNode) {
        nodesData.push(...extractedNodes);
    } else {
        nodesData.push(...extractedEdges);
    }
  });

  return nodesData;
}

const htmlFilePath = 'view_total_time-2022-12-04-2022-12-10.html';
const extractedNodes = parseHTML(htmlFilePath, true);

console.log(JSON.stringify(extractedNodes));
console.log("------------------------------------------------------------------------------")
const extractedEdges = parseHTML(htmlFilePath, false);

console.log(JSON.stringify(extractedEdges));
