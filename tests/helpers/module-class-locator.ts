/**
 * Convert a simple class name to a module class selector
 * eg:
 * moduleClassSelector('c-button') => '[class*="_c-button__"],[class*="_c-button--"]'
 * @param className
 */
export function moduleClassSelector(className: string): string {
	return `[class*="_${className}__"],[class*="_${className}--"]`;
}
