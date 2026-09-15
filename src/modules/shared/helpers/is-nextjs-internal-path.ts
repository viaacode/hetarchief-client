import { isString } from 'es-toolkit/compat';

const NEXT_JS_INTERNAL_PATHS = ['_next/', '.well-known/'];

/**
 * Normalizes both forms we receive: a request url ("/nl/.well-known/foo?x=1")
 * and the catch all route param (string or string[]: ["\.well-known", "foo"])
 */
function normalizePath(path: string | string[] | undefined): string | null {
	if (Array.isArray(path)) {
		return path.join('/');
	}
	if (!isString(path)) {
		return null;
	}
	return path.split('?')[0].replace(/^\/+/, '');
}

export function isNextJsInternalPath(path: string | string[] | undefined): boolean {
	const normalized = normalizePath(path);
	if (normalized === null) {
		return false;
	}
	return NEXT_JS_INTERNAL_PATHS.some(
		(internalPath) => normalized.startsWith(internalPath) || normalized.includes(`/${internalPath}`)
	);
}
