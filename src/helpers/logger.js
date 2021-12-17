class Logger {
  static info (text) {
    console.log(`*** ${text} ***`);
  }

  static space () {
    console.log('=========================');
  }
}

export { Logger };