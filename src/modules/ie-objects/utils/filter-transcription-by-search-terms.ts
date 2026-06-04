import type { OcrSearchResult } from '@ie-objects/ie-objects.types';
import { isLiteralSearchTerm, resolveSearchTerm } from '@ie-objects/utils/search-term.util';

const IS_CHAR_PART_OF_WORD = /[a-zA-Z0-9]/i;

function isBeginningOrEndOfWord(prevChar: string, nextChar: string): boolean {
	const isStartOfWord = !IS_CHAR_PART_OF_WORD.test(prevChar);
	const isEndOfWord = !IS_CHAR_PART_OF_WORD.test(nextChar);
	const isMiddleOfWord = !isStartOfWord && !isEndOfWord;

	return !isMiddleOfWord;
}

export function filterTranscriptionBySearchTerms(
	pageOcrTranscripts: (string | null)[],
	searchTerms: string[]
): OcrSearchResult[] {
	const searchResultsTemp: OcrSearchResult[] = [];

	if (!searchTerms.length) {
		return [];
	}

	for (const searchTerm of searchTerms) {
		const isLiteral = isLiteralSearchTerm(searchTerm);
		const resolvedSearchTerm = resolveSearchTerm(searchTerm);

		pageOcrTranscripts.forEach((pageOcrTranscript, pageIndex) => {
			if (!pageOcrTranscript) {
				return; // Skip this page since it doesn't have an ocr transcript
			}
			let searchTermCharacterOffset: number = pageOcrTranscript.indexOf(resolvedSearchTerm);
			let searchTermIndexOnPage = 0;
			while (searchTermCharacterOffset !== -1) {
				let shouldAddItem = false;

				if (isLiteral) {
					shouldAddItem = true;
				} else {
					const prevChar = pageOcrTranscript.charAt(searchTermCharacterOffset - 1);
					const nextChar = pageOcrTranscript.charAt(
						searchTermCharacterOffset + resolvedSearchTerm.length
					);

					if (isBeginningOrEndOfWord(prevChar, nextChar)) {
						shouldAddItem = true;
					}
				}
				if (shouldAddItem) {
					const searchResult: OcrSearchResult = {
						pageIndex,
						searchTerm: resolvedSearchTerm,
						searchTermCharacterOffset,
						searchTermIndexOnPage,
					};
					searchResultsTemp.push(searchResult);
					searchTermIndexOnPage += 1;
				}

				searchTermCharacterOffset = pageOcrTranscript?.indexOf(
					resolvedSearchTerm,
					searchTermCharacterOffset + 1
				);
			}
		});
	}

	return searchResultsTemp;
}
