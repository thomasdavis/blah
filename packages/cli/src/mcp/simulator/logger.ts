import chalk from 'chalk';
import boxen from 'boxen';
import wrapAnsi from 'wrap-ansi';

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

export function logTutorial(message: string) {
  const terminalWidth = process.stdout.columns || 80; // Get terminal width
  const wrappedMessage = wrapAnsi(message, terminalWidth - 4, { hard: true });

  const formattedMessage = boxen(chalk.bold.hex('#F0790C')(wrappedMessage), {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: '#F0BF2B',
    title: 'Tutorial'
  });

  console.log(formattedMessage);
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