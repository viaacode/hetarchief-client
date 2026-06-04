export function isLiteralSearchTerm(searchTerm: string): boolean {
	return searchTerm.startsWith('"') && searchTerm.endsWith('"');
}

export function resolveSearchTerm(searchTerm: string): string {
	return isLiteralSearchTerm(searchTerm) ? searchTerm.slice(1, -1) : searchTerm;
}

export function normalizeText(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/([\u0300-\u036f])/g, '');
}

export function stringifySearchTerms(normalizedSearchTerm: string): string[] {
	const result: string[] = [];
	const normalizedSearchTermString = normalizeText(normalizedSearchTerm);
	let i = 0;

	while (i < normalizedSearchTermString.length) {
		// Skip whitespace
		while (i < normalizedSearchTermString.length && /\s/.test(normalizedSearchTermString[i])) {
			i++;
		}

		if (i >= normalizedSearchTermString.length) {
			break;
		}

		// Quoted token
		if (normalizedSearchTermString[i] === '"') {
			const start = i++;

			while (i < normalizedSearchTermString.length && normalizedSearchTermString[i] !== '"') {
				i++;
			}

			if (i < normalizedSearchTermString.length) {
				i++; // include closing quote

				const token = normalizedSearchTermString.slice(start, i);

				// Remove empty/whitespace-only quoted literals
				const content = token.slice(1, -1);
				if (content.length > 0) {
					result.push(token);
				}
			} else {
				// Unclosed quote => ignore
				break;
			}
		} else {
			// Unquoted token
			const start = i;

			while (i < normalizedSearchTermString.length && !/\s/.test(normalizedSearchTermString[i])) {
				i++;
			}

			result.push(normalizedSearchTermString.slice(start, i));
		}
	}

	return result;
}
