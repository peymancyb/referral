import { createDirectories, getDirectories, getLogsDirectory, getProcessedDirectory, getRootDirectory } from './';
import { getSeparatedReferralAndBusinessDirectory } from './directories';

function createRequiredFolders () {
  const processedDirectory = getProcessedDirectory();
  const separatedDirectory = getSeparatedReferralAndBusinessDirectory();
  // create empty folders 
  // based on the same structure of the root folder

  createDirectories([processedDirectory]);
  createDirectories([separatedDirectory]);
}

export {
  createRequiredFolders
};