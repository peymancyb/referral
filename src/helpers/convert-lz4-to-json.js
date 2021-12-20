import * as LZ4 from 'lz4';
import * as path from 'path';
import fs from 'fs';

function getLz4FileName (filePath) {
  const names = filePath.split('/');
  const fileName = names[names.length - 1]; 
  const jsonFileName = fileName.replace('.json.lz4', '.json');
  const jsonDirectory = filePath.replace('sematext_f89f792a', 'temp');
  const logsDirectory = filePath.replace('sematext_f89f792a', 'logs');
  return {
    fileName,
    jsonFileName,
    jsonDirectory,
    logsDirectory,
    originalFilePath: filePath
  };
}

async function convertLZ4FileToJson (filePathData) {
  const { originalFilePath, jsonDirectory } = filePathData;
  return new Promise((resolve) => {
    // decoding LZ4 format
    const decoder = LZ4.createDecoderStream();
    const input = fs.createReadStream(originalFilePath);
    const output = fs.createWriteStream(jsonDirectory);
    input.pipe(decoder).pipe(output).on('finish', () => {
      resolve(jsonDirectory);
    });
  });
}

export { convertLZ4FileToJson, getLz4FileName };