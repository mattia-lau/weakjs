import dayjs from 'dayjs';
import { renameSync, statSync } from 'fs';
import { join } from 'path';
import { basePath, err, std } from './constant';

export const isOverDay = (birthtime: string | number | Date) => {
  return dayjs().diff(birthtime, 'day') >= 1;
};

export const isOverWeek = (birthtime: string | number | Date) => {
  const start = dayjs(birthtime).startOf('week');
  const end = dayjs(birthtime).endOf('week');
  const now = dayjs();

  return !now.isBetween(start, end);
};

export const isOverMonth = (birthtime: string | number | Date) => {
  return dayjs(birthtime).toDate().getMonth() !== new Date().getMonth();
};

export const rename = (type: string, rolling?: 'daily' | 'weekly' | 'monthly') => {
  let filename;

  const { birthtime } = statSync(type === 'stdout' ? std : err);

  switch (rolling) {
    case 'daily':
      filename = `${type}.${dayjs(birthtime).format('YYYY-MM-DD')}.log`;
      break;
    case 'weekly':
      filename = `${type}.${dayjs(birthtime).startOf('week').format('YYYY-MM-DD')}.log`;
      break;
    case 'monthly':
      filename = `${type}.${dayjs(birthtime).format('YYYY-MM')}.log`;
      break;
  }

  renameSync(join(basePath, `${type}.log`), join(basePath, filename));
};

export const convertToText = (obj: any) => {
  const string = [];

  if (!obj) return;

  if (obj instanceof Error) {
    const err: Error = obj;
    string.push(err.message, '\t', err.stack);
  } else if (typeof obj == 'object' && obj.join == undefined) {
    string.push('{');
    for (const prop in obj) {
      string.push(prop, ': ', convertToText(obj[prop]), ', ');
    }
    if (Object.keys(obj).length > 0) string.splice(string.length - 1, 1);
    string.push('}');
  } else if (typeof obj == 'object' && !(obj.join == undefined)) {
    string.push('[');
    for (const prop in obj) {
      string.push(convertToText(obj[prop]), ', ');
    }
    string.splice(string.length - 1, 1);
    string.push(']');
  } else if (typeof obj == 'function') {
    string.push(obj.toString());
  } else {
    string.push(JSON.stringify(obj, null, 2));
  }

  return string.join('');
};
