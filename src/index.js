import * as LZ4 from 'lz4';
import * as path from 'path';
import fs from 'fs';
import pMap from 'p-map';
import { createRequiredFolders, filterBackupFiles, findMissingReferrals, Logger, separateLogs } from './helpers';

async function main () {
  Logger.info('MAIN PROCESS STARTED...');

  Logger.info('CREATING DIRECTORIES ...');
  createRequiredFolders();
  Logger.info('DIRECTORIES CREATED SUCCESSFULLY!');

  Logger.info('FILTERING BACKUP FILES STARTED ...');
  filterBackupFiles();
  Logger.info('FILTERING BACKUP FILES COMPLETED!');

  Logger.space();
  Logger.space();

  Logger.info('PROCESSING OF SEPARATING LOGS STARTED');
  const separatedLogs = separateLogs();
  Logger.info('PROCESSING OF SEPARATING LOGS COMPLETED');

  Logger.space();
  Logger.info('PROCESSING OF FINDING MISSING REFERRAL STARTED');
  findMissingReferrals(separatedLogs);
  Logger.info('PROCESSING OF FINDING MISSING REFERRAL COMPLETED ');
}

main();