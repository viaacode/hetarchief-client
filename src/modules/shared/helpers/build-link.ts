import { get, isString } from 'lodash-es';
import queryString from 'query-string';

export type RouteParams = { [key: string]: string | number | undefined };

export const getMissingParams = (route: string): string[] =>
	route.split('/').filter((r) => r.match(/^:/));
export const navigationConsoleError = (route: string, missingParams: string[] = []) => {
	const paramsString = missingParams.join(', ');
	console.error(`The following params were not included: [${paramsString}] for route ${route}`);
};

export const buildLink = (
	route: string,
	params: RouteParams = {},
	search?: string | { [paramName: string]: string }
): string => {
	let builtLink = route;

	// Replace url with given params
	Object.keys(params).forEach((param: string) => {
		builtLink = builtLink.replace(`:${param}`, String(get(params, [param], '')));
	});

	const missingParams = getMissingParams(builtLink);

	// Return empty string if not all params were replaced
	if (missingParams.length > 0) {
		navigationConsoleError(route, missingParams);

		return '';
	}

	// Add search query if present
	return search
		? `${builtLink}?${isString(search) ? search : queryString.stringify(search)}`
		: builtLink;
};
