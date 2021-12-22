import fs from 'fs';

function appendToFile (filePath, data) {
  fs.appendFileSync(filePath, JSON.stringify(data));
}

function writeToFile (filePath, data) {
  fs.writeFileSync(filePath, data);
}

export {
  appendToFile,
  writeToFile
};