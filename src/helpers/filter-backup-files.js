import fs from 'fs';
import pMap from 'p-map';
import { appendToFile, convertLZ4FileToJson, getDirectories, getLz4FileName, getProcessedDirectory, getRootDirectory, Logger, readFileLineByLine, writeToFile } from './';

async function saveReferralRelatedLogs (data, logPath) {
  if (data.length) {
    Logger.info(`REFERRAL INFO FOUND IN ${logPath}`);
    writeToFile(logPath, data);
  }
}

async function handleFileProcessing (filePath) {
  const filePathData = getLz4FileName(filePath);
  // 1) convert LZ4 to json
  await convertLZ4FileToJson(filePathData);

  // 3) save if any findings
  // saveReferralRelatedLogs(data, filePathData.logsDirectory);
}

function getAlreadyCheckedFiles () {
  const processedDirectory = getProcessedDirectory();
  const processPath = `${processedDirectory}/index.js`;

  if (!fs.existsSync(processPath)) {
    writeToFile(processPath, '');
  }
  const content = fs.readFileSync(`${processPath}`);
  const alreadyCheckedFiles = content.toString().split('"');
  return alreadyCheckedFiles.filter(item => item.length);
}

async function filterBackupFiles () {
  const rootDirectory = getRootDirectory();
  const alreadyCheckedFiled = getAlreadyCheckedFiles();

  const processedDirectory = getProcessedDirectory();
  const processPath = `${processedDirectory}/index.js`;

  const allFilesPath = getDirectories(rootDirectory).filter(_path => alreadyCheckedFiled.indexOf(_path) === -1);
  const filesLength = allFilesPath.length;

  Logger.info(`PROCESS FOR ${filesLength} FILES STARTED`);

  let i = 1;

  const mapper = async (filePath) => {
    Logger.info(`PROCESSING FILE ${i} OUT OF ${filesLength} FILES`);
    await handleFileProcessing(filePath);
    appendToFile(processPath, filePath);
    Logger.info(`PROCESSING FILE ${i} OUT OF ${filesLength} FILES COMPLETED!`);
    i++;
  };
  
  await pMap(allFilesPath, mapper, { concurrency: 6 });
  
  Logger.info('FILE PROCESSING COMPLETED!');
  Logger.space();
}

export {
  filterBackupFiles
};