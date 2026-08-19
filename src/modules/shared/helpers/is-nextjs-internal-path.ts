import { isString } from 'es-toolkit/compat';

const NEXT_JS_INTERNAL_PATHS = ['/_next/', '.well-known/'];

export function isNextJsInternalPath(path: string): boolean {
	return (
		isString(path) && NEXT_JS_INTERNAL_PATHS.some((internalPath) => path.startsWith(internalPath))
	);
}
