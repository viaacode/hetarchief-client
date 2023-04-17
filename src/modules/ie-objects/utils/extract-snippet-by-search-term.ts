import { minBy, truncate } from 'lodash-es';

export function extractSnippetBySearchTerm(
	fullText: string,
	searchTerms: string[],
	snippetLength: number
): string {
	const [firstSearchTermFound, firstOccurrenceIndex] = minBy(
		searchTerms.map((searchTerm) => [
			searchTerm,
			fullText.toLowerCase().indexOf(searchTerm.toLowerCase()),
		]),
		(termsAndOccurrence) => termsAndOccurrence[1]
	) || [null, null];
	if (
		!firstOccurrenceIndex ||
		!firstSearchTermFound ||
		firstOccurrenceIndex === -1 ||
		firstOccurrenceIndex === 0
	) {
		// searchTerm not found
		// or first occurrence at start of text
		return truncate(fullText, { length: snippetLength, omission: '...' });
	}
	if (firstSearchTermFound.length > snippetLength) {
		// search term is larger than snippet => show beginning of search term
		return '...' + truncate(firstSearchTermFound, { length: snippetLength, omission: '...' });
	} else {
		// Search term is less than the snippet length => cut around the search term with leading and trailing ...
		const extraCharacters = snippetLength - firstSearchTermFound.length;
		// const startOfCut = Math.max(firstOccurrenceIndex - Math.floor(extraCharacters / 2), 0);
		const endOfCut = Math.min(
			firstOccurrenceIndex + firstSearchTermFound.length + Math.ceil(extraCharacters / 2),
			fullText.length
		);
		const startOfCut = endOfCut - snippetLength;
		return (
			(startOfCut > 0 ? '...' : '') +
			truncate(fullText.substring(endOfCut - snippetLength), {
				length: snippetLength,
				omission: '...',
			})
		);
	}
}
