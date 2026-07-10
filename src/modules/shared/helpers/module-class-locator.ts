/**
 * Convert a component name + local class name to a module class selector.
 * Requires both the component name and the local class to be present, matching both the
 * webpack CSS-module format (`Component_local-class__hash`) and the Turbopack format
 * (`Component-module-scss-module__hash__local-class`) -- the generated hash sits on the
 * opposite side of the local class name depending on the bundler, so the Turbopack side is
 * matched via two attribute selectors anchored to the fixed parts either side of the hash.
 * eg:
 * moduleClassSelector('Footer', 'c-footer') =>
 *   '[class*="Footer_c-footer__"], [class*="Footer-module-scss-module__"][class*="__c-footer"]'
 * @param component
 * @param localClass
 * @param suffix
 */
export function moduleClassSelector(component: string, localClass: string, suffix = '__'): string {
	// TODO: remove the webpack backwards compatibility when turbopack is confirmed to be working good
	const webpack = `[class*="${component}_${localClass}${suffix}"]`;
	const turbopack = `[class*="${component}-module-scss-module${suffix}"][class*="${suffix}${localClass}"]`;
	return `${webpack}, ${turbopack}`;
}
