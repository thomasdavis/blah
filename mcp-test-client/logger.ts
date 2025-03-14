import winston from 'winston';
import chalk from 'chalk';
import Table from 'cli-table3';
import util from 'util';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'gray'
  }
};

const customFormat = winston.format.printf(({ level, message, timestamp, data }) => {
  const prefix = chalk.bold(`[${timestamp}] ${level.toUpperCase()}`);
  
  if (!data) {
    return `${prefix} ${message}`;
  }

  if (Array.isArray(data)) {
    const table = new Table({
      head: ['Index', 'Value'],
      style: { head: ['cyan'] }
    });
    data.forEach((item, index) => {
      table.push([index, util.inspect(item, { depth: 5, colors: true })]);
    });
    return `${prefix} ${message}\n${table.toString()}`;
  }

  if (typeof data === 'object') {
    const table = new Table({
      style: { head: ['cyan'] }
    });
    Object.entries(data).forEach(([key, value]) => {
      table.push([
        chalk.cyan(key),
        util.inspect(value, { depth: 5, colors: true })
      ]);
    });
    return `${prefix} ${message}\n${table.toString()}`;
  }

  return `${prefix} ${message}: ${util.inspect(data, { depth: 5, colors: true })}`;
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true })
    })
  ]
});

winston.addColors(customLevels.colors);

export const log = (message: string, data?: any) => {
  logger.info(message, { data });
};

export const logError = (message: string, data?: any) => {
  logger.error(message, { data });
};

export const logWarn = (message: string, data?: any) => {
  logger.warn(message, { data });
};

export const logDebug = (message: string, data?: any) => {
  logger.debug(message, { data });
};

export const logSection = (title: string) => {
  const separator = '='.repeat(50);
  logger.info(`\n${separator}\n${chalk.bold.green(title)}\n${separator}`);
};

export const logStep = (step: string) => {
  const separator = '-'.repeat(30);
  logger.info(`\n${separator}\n${chalk.bold.blue(step)}\n${separator}`);
};
