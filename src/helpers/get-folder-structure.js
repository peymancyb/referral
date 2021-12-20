const path = require('path');
const fs = require('fs');

const blackList = ['.DS_Store'];

function readDirectory (dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, _names) => {
      if (err) {
        console.log(`Unable to scan directory: ${err}`);
        return resolve([]);
      }
      const dirList = _names.filter(name => !blackList.includes(name));
      resolve(dirList);
    });
  });
}

/**
 * 
 * @param {string} mainDir 
 * @returns 
 * {
 *  structure: [
 *    {
 *      name: string, => file name
 *      file_path: string => the file full path
 *    }
 *  ],
 *  all_files: [] => array of all files full path
 *  total_files: number => number of all files
 * }
 */
async function getFolderStructure (mainDir) {
  const structure = {};
  const folders = await readDirectory(mainDir);
  const directories = folders.map((folder) => readDirectory(`${mainDir}/${folder}`).then((list) => {
    structure[folder] = list;
  }));
  await Promise.all(directories);
  return Object.keys(structure).reduce((acc, key) => {
    const fileList = structure[key].map(file => ({
      name: file,
      file_path: `${mainDir}/${key}/${file}` 
    }));
    acc.structure[key] = fileList;
    const filePaths = fileList.map(file => file.file_path);
    acc.all_files = [...acc.all_files, ...filePaths];
    acc.total_files += fileList.length;
    return acc;
  }, {
    structure: {},
    all_files: [],
    total_files: 0
  });
}

export { getFolderStructure };