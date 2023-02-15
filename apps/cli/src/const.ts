import { resolve } from 'node:path';
import { homedir } from 'os';

const CAA_DIR = '.caa';

export const DEFAULT_APP_HOME = () => resolve(homedir(), CAA_DIR);
