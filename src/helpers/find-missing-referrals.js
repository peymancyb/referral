import { getDirectories, getLogsDirectory, getSeparatedReferralAndBusinessDirectory, Logger, readFileLineByLine, writeToFile } from '.';
const fs = require('fs');

function getReferralCodesFromLog ({ 
  RequestPath, 
  RequestMethod, 
  ClientHost
}) {
  return {
    RequestPath, 
    RequestMethod,
    ClientHost,
    referral_code: RequestPath.split('code=')[1]
  };
}

function separateLogs () {
  const logsDirectory = getLogsDirectory();
  const separatedDirectory = getSeparatedReferralAndBusinessDirectory();
  const directories = getDirectories(logsDirectory);
  const referralLogs = [];
  const businessLogs = [];

  directories.forEach((_directory, _index) => {
    Logger.info(`SEPARATING ${_index + 1} OUT OF ${directories.length} DIRECTORIES`);
    const content = fs.readFileSync(`${_directory}`);
    const data = content.toString().split(/\r?\n/);
    data.forEach((line, index) => {
      try {
        if (!line) {
          return;
        }
        const _log = JSON.parse(`${line}`);
        if (_log.RequestPath.includes('validate/code?code=')) {
          referralLogs.push(getReferralCodesFromLog(_log));
        }
        if (_log.RequestPath.includes('api/users') && _log.RequestPath.includes('business')) {
          businessLogs.push(_log);
        }
      } catch (e) {
        console.log('line is not readable');
      }
    });
  });

  const referralCodePath = `${separatedDirectory}/referral.json`;
  writeToFile(referralCodePath, JSON.stringify(referralLogs));
  const businessPath = `${separatedDirectory}/business.json`;
  writeToFile(businessPath, JSON.stringify(businessLogs));
  return {
    referralLogs,
    businessLogs
  };
}

const isMobile = {
  Android: function (userAgent) {
    return userAgent.match(/Android/i);
  },
  BlackBerry: function (userAgent) {
    return userAgent.match(/BlackBerry/i);
  },
  iOS: function (userAgent) {
    return userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function (userAgent) {
    return userAgent.match(/Opera Mini/i);
  },
  Windows: function (userAgent) {
    return userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i);
  },
  any: function (userAgent) {
    return (
      isMobile.Android(userAgent) || 
        isMobile.BlackBerry(userAgent) || 
        isMobile.iOS(userAgent) || 
        isMobile.Opera(userAgent) || 
        isMobile.Windows(userAgent)
    );
  }
};

function findMissingReferrals (separatedLogs) {
  if (!separatedLogs) {
    console.log('no separated file found');
    return;
  }
  const {
    referralLogs,
    businessLogs
  } = separatedLogs;

  const successfullyCreatedBusinesses = [];
  referralLogs.map(referralLog => {
    const _businessLogs = businessLogs.filter(_businessLog => {
      return (
        _businessLog.ClientHost === referralLog.ClientHost &&
        _businessLog.RequestMethod === 'POST' &&
        _businessLog.status === 200
      );
    });

    // user_agent
    _businessLogs.forEach(business => {
      successfullyCreatedBusinesses.push(
        Object.assign(
          {}, 
          business, 
          {
            isMobile: business.user_agent ? isMobile.any(business.user_agent) : 'user agent not provided'
          }
        )
      );
    });
  });

  const separatedDirectory = getSeparatedReferralAndBusinessDirectory();
  const resultPath = `${separatedDirectory}/result.json`;
  writeToFile(resultPath, JSON.stringify(successfullyCreatedBusinesses));
}

export {
  separateLogs,
  findMissingReferrals
};