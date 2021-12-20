import * as path from 'path';
import dirTree from 'directory-tree';
import fs from 'fs';
import { replaceName } from '.';

const getRootDirectory = () => path.join(__dirname, '../../../sematext_f89f792a');
const getTempDirectory = () => path.join(__dirname, '../../../temp_f89f792a');
const getLogsDirectory = () => path.join(__dirname, '../../../logs_f89f792a');

const removePathExtension = (_path, mainPath, copyPath, extension = '.lz4') => {
  _path = _path.replace(mainPath, copyPath);
  const pathSplitted = _path.split('/');
  const elementToRemove = pathSplitted.findIndex(_item => _item.indexOf(extension) !== -1);
  if (elementToRemove !== -1) {
    pathSplitted.splice(elementToRemove, 1);
  }
  return pathSplitted.join('/');
};

function getDirectories (mainPath, copyPath) {
  const tree = dirTree(mainPath);
  const directories = [];
  const _getDirectoryList = (_children) => {
    _children.forEach(item => {
      if (item.name === '.DS_Store') {
        return;
      }
      if (item.children) {
        return _getDirectoryList(item.children);
      }
      const _path = copyPath ? removePathExtension(item.path, mainPath, copyPath) : item.path;
      return directories.push(_path);
    });
  };
  _getDirectoryList(tree.children);
  return directories;
}

function createDirectories (directories) {
  directories.map(_dir => {
    if (!fs.existsSync(_dir)) {
      fs.mkdirSync(_dir, { recursive: true });
    }
  });
}

export {
  getRootDirectory,
  getDirectories,
  createDirectories,
  getTempDirectory,
  getLogsDirectory
};