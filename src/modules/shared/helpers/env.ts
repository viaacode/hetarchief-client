export function getEnv(name: keyof Window['_ENV_']): string | undefined {
	return window._ENV_ ? window._ENV_[name] : process.env[name];
}
