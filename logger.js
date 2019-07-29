const chalk = require('chalk');

class Logger {
  constructor(options) {
    this.logLevelMap = {
      error: 1,
      warn: 2,
      success: 3,
      info: 3,
      debug: 4,
    };
    this.options = Object.assign(
      {
        logLevel: 3,
        silence: false,
      },
      options
    );
  }

  setOptions(options) {
    Object.assign(this.options, options);
  }

  debug(...args) {
    this.status('magenta', 'debug', ...args);
  }

  error(...args) {
    process.exitCode = process.exitCode || 1;
    this.status('red', 'error', ...args);
  }

  warn(...args) {
    this.status('yellow', 'warning', ...args);
  }

  success(...args) {
    this.status('green', 'success', ...args);
  }

  info(...args) {
    this.status('cyan', 'info', ...args);
  }

  status(color, type, ...args) {
    const { logLevel, silence } = this.options;
    if (logLevel < this.logLevelMap[type] || !!silence) {
      return;
    }

    let func = !!~['warning', 'error'].indexOf(type) ? type : 'log';
    console[func](chalk[color](type), ...args);
  }
}

module.exports = new Logger();
