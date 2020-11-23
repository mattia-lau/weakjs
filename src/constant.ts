import { join } from 'path';

const root = '';
export const basePath = join(root, 'logs');
export const std = join(root, 'logs', 'stdout.log');
export const err = join(root, 'logs', 'stderr.log');
