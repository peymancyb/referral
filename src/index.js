import * as LZ4 from 'lz4';
import * as path from 'path';
import fs from 'fs';
import { appendToFile, convertLZ4FileToJson, getAllFilesInDirectory, getLogResultDirectory, getLz4FileName, getRootDirectory, Logger, readFile, readFileLineByLine, replaceName, writeToFile } from './helpers';

function validateLog (log) {
  return true;
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

async function saveReferralRelatedLogs (data, fileName) {
  const logDirectory = getLogResultDirectory(fileName);
  const validLogs = data.filter((log) => validateLog(log));
  if (validLogs.length) {
    writeToFile(logDirectory, data);
  }
}

async function handleFileProcessing (filePath) {
  const filePathData = getLz4FileName(filePath);

  // 1) convert LZ4 to json
  await convertLZ4FileToJson(filePathData);

  // 2) scan json
  const data = readFileLineByLine(filePathData.jsonDirectory);

  // 3) save if any findings
  saveReferralRelatedLogs(data, filePathData.jsonFileName);

  // 4) delete temporary created json file
  fs.unlinkSync(filePathData.jsonDirectory);
}

async function main () {
  const rootDirectory = getRootDirectory();
  const allFilesPath = await getAllFilesInDirectory(rootDirectory);
  const filesLength = allFilesPath.length;

  Logger.info(`PROCESS FOR ${filesLength} FILES STARTED`);
  
  for (let i = 0; i < filesLength; i++) {
    Logger.info(`PROCESSING FILE ${i + 1} OUT OF ${filesLength} FILES`);
    await handleFileProcessing(allFilesPath[i]);
    Logger.info(`PROCESSING FILE ${i + 1} OUT OF ${filesLength} FILES COMPLETED!`);
  }
  
  Logger.info('FILE PROCESSING COMPLETED!');
  Logger.space();
}

main();