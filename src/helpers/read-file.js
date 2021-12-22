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

function validateData (log) {
  if (log.RequestPath) {
    return log.RequestPath.includes('validate/code?code=');
  }
  if (log.RequestPath) {
    // example of business creation request
    // "RequestPath": "/api/users/[user_id]/business",
    return log.RequestPath.includes('api/users') && log.RequestPath.includes('business');
  }
  return false;
}

function readFileLineByLine (filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = [];
  const content = fs.readFileSync(`${filePath}`);
  content.toString().split(/\r?\n/).forEach(function (line) {
    try {
      if (!line) {
        return;
      }
      const _data = JSON.parse(`${line}`);
      if (validateData(_data)) {
        data.push(_data);
      }
    } catch (e) {
      console.log('line is not readable', filePath, e);
    }
  });
  return data;
}

export { parseFileToJson, readFileLineByLine, replaceName, readFile };