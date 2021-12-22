import * as LZ4 from 'lz4';
import * as path from 'path';
import fs from 'fs';
import { LOGS_PATH, SEMA_TEXT_PATH } from '.';

function getLz4FileName (filePath) {
  const names = filePath.split('/');
  const fileName = names[names.length - 1]; 
  const jsonFileName = fileName.replace('.json.lz4', '.json');
  const logsDirectory = filePath.replace(SEMA_TEXT_PATH, LOGS_PATH).replace('.json.lz4', '.json');
  return {
    fileName,
    jsonFileName,
    logsDirectory,
    originalFilePath: filePath
  };
}

async function convertLZ4FileToJson (filePathData) {
  const { originalFilePath, logsDirectory } = filePathData;
  return new Promise((resolve) => {
    // decoding LZ4 format
    const decoder = LZ4.createDecoderStream();
    const input = fs.createReadStream(originalFilePath);
    const output = fs.createWriteStream(logsDirectory);
    input.pipe(decoder).pipe(output).on('finish', () => {
      resolve(logsDirectory);
    });
  });
}

export { convertLZ4FileToJson, getLz4FileName };