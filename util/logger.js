const fs = require('fs');

const logsDir = `${__dirname}/../logs/`;

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const winston = require('winston');
require('winston-daily-rotate-file');

const infoTr = new (winston.transports.DailyRotateFile)({
  level: 'info',
  name: 'info',
  filename: `${logsDir}/%DATE%.info.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '30d'
});

const errorTr = new (winston.transports.DailyRotateFile)({
  level: 'error',
  name: 'error',
  filename: `${logsDir}/%DATE%.error.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '30d'
});

const logger = winston.createLogger({
  transports: [infoTr, errorTr],
});

module.exports = logger;
