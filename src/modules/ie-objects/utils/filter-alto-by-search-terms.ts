import {
	isLiteralSearchTerm,
	normalizeText,
	resolveSearchTerm,
} from '@ie-objects/utils/search-term.util';
import type { TextLine } from '@iiif-viewer/IiifViewer.types';

export function filterAltoBySearchTerms(
	altoItems: TextLine[],
	searchTerms: string[]
): {
	text: TextLine;
	tabbable: boolean;
}[] {
	if (!searchTerms || !altoItems) {
		return [];
	}

	const matchedAltoItems = new Set<{
		text: TextLine;
		tabbable: boolean;
	}>();

	for (const searchTerm of searchTerms) {
		const isLiteral = isLiteralSearchTerm(searchTerm);
		const resolvedSearchTerm = resolveSearchTerm(searchTerm);
		let matches: {
			text: TextLine;
			tabbable: boolean;
		}[] = [];

		if (isLiteral) {
			const tokens = resolvedSearchTerm.split(' ');

			// Single token literal => contains
			if (tokens.length === 1) {
				matches = altoItems
					.filter((item) => normalizeText(item.text).includes(tokens[0]))
					.map((item) => ({
						text: item,
						tabbable: true,
					}));
			} else {
				matches.concat(
					...altoItems
						.filter((item) => normalizeText(item.text).includes(resolvedSearchTerm))
						.map((item) => ({
							text: item,
							tabbable: true,
						}))
				);

				for (
					let altoItemIndex = 0;
					altoItemIndex <= altoItems.length - tokens.length;
					altoItemIndex++
				) {
					let found = true;

					for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
						const normalizedValue = normalizeText(altoItems[altoItemIndex + tokenIndex].text);
						const currentSearchPart = tokens[tokenIndex];

						if (tokenIndex === 0) {
							if (!normalizedValue.endsWith(currentSearchPart)) {
								found = false;
								break;
							}
						} else if (tokenIndex === tokens.length - 1) {
							if (!normalizedValue.startsWith(currentSearchPart)) {
								found = false;
								break;
							}
						} else if (normalizedValue !== currentSearchPart) {
							found = false;
							break;
						}
					}

					if (found) {
						matches.push(
							...altoItems.slice(altoItemIndex, altoItemIndex + 1).map((item) => ({
								text: item,
								tabbable: true,
							}))
						);
						matches.push(
							...altoItems.slice(altoItemIndex + 1, altoItemIndex + tokens.length).map((item) => ({
								text: item,
								tabbable: false,
							}))
						);
					}
				}
			}
		} else {
			matches = altoItems
				.filter((item) => {
					const normalizedValue = normalizeText(item.text);
					return (
						normalizedValue.startsWith(resolvedSearchTerm) ||
						normalizedValue.endsWith(resolvedSearchTerm)
					);
				})
				.map((item) => ({
					text: item,
					tabbable: true,
				}));
		}

		for (const matchedItem of matches) {
			matchedAltoItems.add(matchedItem);
		}
	}
	return [...matchedAltoItems];
}
