/**
 * Convert a simple class name to a module class selector
 * eg:
 * moduleClassSelector('c-button') => '[class*="_c-button__"]'
 * @param className
 * @param suffix
 */
export function moduleClassSelector(className: string, suffix: string = '__'): string {
	return `[class*="_${className}${suffix}"]`;
}
