/**
 * Creates a boolean URL parameter handler with a default value.
 * If the value is equal to the default, it is omitted from the URL.
 * true is encoded as '1' and false as '0'.
 * @param defaultValue
 * @constructor
 */
export const BooleanParamWithDefault = (defaultValue: boolean) => ({
	encode: (value: boolean | null | undefined) => {
		// Omit from URL if equal to default or undefined
		if (value === defaultValue || value == null) return undefined;
		return value ? '1' : '0';
	},
	decode: (value: string | (string | null)[] | null | undefined) => {
		if (value == null) return defaultValue;
		if (value === '1' || value === 'true') return true;
		if (value === '0' || value === 'false') return false;
		return defaultValue;
	},
});
