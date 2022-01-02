import { createRequiredFolders, filterBackupFiles, findMissingReferrals, Logger, separateLogs } from './helpers';

async function main () {
  Logger.info('MAIN PROCESS STARTED...');

  Logger.info('CREATING DIRECTORIES ...');
  createRequiredFolders();
  Logger.info('DIRECTORIES CREATED SUCCESSFULLY!');

  Logger.space();
  Logger.space();

  Logger.info('PROCESSING OF SEPARATING LOGS STARTED');
  const separatedLogs = await separateLogs();
  Logger.info('PROCESSING OF SEPARATING LOGS COMPLETED');

  Logger.space();
  Logger.info('PROCESSING OF FINDING MISSING REFERRAL STARTED');
  findMissingReferrals(separatedLogs);
  Logger.info('PROCESSING OF FINDING MISSING REFERRAL COMPLETED ');
}

main();