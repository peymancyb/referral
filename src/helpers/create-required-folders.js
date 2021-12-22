import * as LZ4 from 'lz4';
import * as path from 'path';
import fs from 'fs';
import pMap from 'p-map';
import { createDirectories, getDirectories, getLogsDirectory, getProcessedDirectory, getRootDirectory } from './';
import { getSeparatedReferralAndBusinessDirectory } from './directories';

function createRequiredFolders () {
  const rootDirectoryPath = getRootDirectory();
  const logsDirectoryPath = getLogsDirectory();
  const processedDirectory = getProcessedDirectory();
  const separatedDirectory = getSeparatedReferralAndBusinessDirectory();
  // create empty folders 
  // based on the same structure of the root folder
  const logsDirectory = getDirectories(rootDirectoryPath, logsDirectoryPath);
  createDirectories(logsDirectory);

  createDirectories([processedDirectory]);
  createDirectories([separatedDirectory]);
}

export {
  createRequiredFolders
};