import { LogLevel } from './types';

const Reset = '\x1b[0m';
const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

export const red = (text: string) => {
  return `${FgRed}${text}${Reset}`;
};

export const black = (text: string) => {
  return `${FgBlack}${text}${Reset}`;
};

export const blue = (text: string) => {
  return `${FgBlue}${text}${Reset}`;
};

export const green = (text: string) => {
  return `${FgGreen}${text}${Reset}`;
};

export const yellow = (text: string) => {
  return `${FgYellow}${text}${Reset}`;
};

export const magenta = (text: string) => {
  return `${FgMagenta}${text}${Reset}`;
};

export const cyan = (text: string) => {
  return `${FgCyan}${text}${Reset}`;
};

export const white = (text: string) => {
  return `${FgWhite}${text}${Reset}`;
};

export const colorize = (level: LogLevel) => {
  if (level === 'info') return green;
  else if (level === 'warn') return yellow;
  else if (level === 'debug') return blue;
  else if (level === 'error') return red;
  else return cyan;
};
