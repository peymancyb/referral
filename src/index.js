import * as LZ4 from 'lz4';
import * as path from 'path';
import fs from 'fs';
import { convertLZ4FileToJson, createDirectories, getDirectories, getLogsDirectory, getLz4FileName, getRootDirectory, getTempDirectory, Logger, readFileLineByLine, writeToFile } from './helpers';

function validateLog (log) {
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

async function saveReferralRelatedLogs (data, logPath) {
  const validLogs = data.filter((log) => validateLog(log));
  if (validLogs.length) {
    Logger.info(`REFERRAL INFO FOUND IN ${logPath}`);
    writeToFile(logPath, data);
  }
}

async function handleFileProcessing (filePath) {
  const filePathData = getLz4FileName(filePath);
  // 1) convert LZ4 to json
  await convertLZ4FileToJson(filePathData);

  // 2) scan json
  const data = readFileLineByLine(filePathData.jsonDirectory);

  // 3) save if any findings
  saveReferralRelatedLogs(data, filePathData.logsDirectory);

  // 4) delete temporary created json file
  fs.unlinkSync(filePathData.jsonDirectory);
}

function createFolders () {
  const rootDirectoryPath = getRootDirectory();
  const tempDirectoryPath = getTempDirectory();
  const logsDirectoryPath = getLogsDirectory();
  // create empty folders 
  // based on the same structure of the root folder
  const tempDirectory = getDirectories(rootDirectoryPath, tempDirectoryPath);
  createDirectories(tempDirectory);

  const logsDirectory = getDirectories(rootDirectoryPath, logsDirectoryPath);
  createDirectories(logsDirectory);
}

async function filterBackupFiles () {
  const rootDirectory = getRootDirectory();

  const allFilesPath = getDirectories(rootDirectory);
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

async function main () {
  Logger.info('MAIN PROCESS STARTED...');

  Logger.info('CREATING TEMP DIRECTORIES ...');
  createFolders();
  Logger.info('TEMP DIRECTORIES CREATED SUCCESSFULLY!');

  Logger.info('FILTERING BACKUP FILES STARTED ...');
  filterBackupFiles();
  Logger.info('FILTERING BACKUP FILES COMPLETED!');
}

main();