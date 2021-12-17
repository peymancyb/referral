const path = require('path');
const fs = require('fs');

function replaceName (fileName) {
  const name = fileName || `unknown-${Date.now()}`;
  return name.replace(/\//g, '*');
}

function parseFileToJson (fullPath) {
  let data = null;
  try {
    const content = fs.readFileSync(fullPath);
    data = JSON.parse(content);
  } catch (err) {
    console.error(err);
  }
  return data;
}

function readFile (fullPath) {
  let content = null;
  try {
    content = fs.readFileSync(fullPath, { encoding: 'utf8' });
  } catch (err) {
    console.error(err);
  }
  return content;
}

function replaceLast (str, search, replace) {
  return str.replace(new RegExp(search + '([^' + search + ']*)$'), replace + '$1');
}

function readFileLineByLine (filePath) {
  const data = [];
  const content = fs.readFileSync(`${filePath}`);
  content.toString().split(/\r?\n/).forEach(function (line) {
    try {
      data.push(JSON.parse(JSON.stringify(line)));
    } catch (e) {
      console.log('line is not readable', line);
    }
  });
  return data;
}

export { parseFileToJson, readFileLineByLine, replaceName, readFile };