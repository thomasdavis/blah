import chalk from 'chalk';

export function log(message: string, data?: unknown) {
  console.log(chalk.blue('→'), message);
  if (data) {
    console.log(chalk.white(JSON.stringify(data, null, 2)));
  }
}

export function logError(message: string, error: unknown) {
  console.error(chalk.red('✖'), message);
  if (error instanceof Error) {
    console.error(chalk.red(error.stack || error.message));
  } else {
    console.error(chalk.red(String(error)));
  }
}

export function logWarn(message: string) {
  console.warn(chalk.yellow('⚠'), message);
}

export function logStep(message: string) {
  console.log(chalk.green('\n◆'), chalk.bold(message));
}

export function logSection(message: string) {
  console.log(chalk.cyan('\n▶'), chalk.bold(message), chalk.cyan('\n' + '='.repeat(message.length + 4)));
}
