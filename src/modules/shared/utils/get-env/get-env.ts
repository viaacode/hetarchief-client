import { EnvVars } from '@shared/types';

export const getEnv = <Key extends keyof EnvVars>(envKey: Key): EnvVars[Key] => {
	return process.env[envKey] ?? '';
};
