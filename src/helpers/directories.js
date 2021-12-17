import * as path from 'path';
import { replaceName } from '.';

const getRootDirectory = () => path.join(__dirname, '../../../sematext');
const getLogResultDirectory = (fileName) => path.join(__dirname, `../logs/${fileName}`);
const getJsonDirectory = (fileName) => path.join(__dirname, `../json/${replaceName(fileName)}`);

export {
  getRootDirectory,
  getLogResultDirectory,
  getJsonDirectory
};