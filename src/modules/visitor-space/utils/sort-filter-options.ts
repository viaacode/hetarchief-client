import { sortBy } from 'lodash-es';

enum CharacterType {
	LETTER = 0,
	NUMBER = 1,
	SYMBOL = 2,
}

function getCharacterType(firstCharacter: string): CharacterType {
	if (/[A-Za-z]/.test(firstCharacter)) {
		return CharacterType.LETTER;
	}
	if (/[0-9]/.test(firstCharacter)) {
		return CharacterType.NUMBER;
	}
	return CharacterType.SYMBOL;
}

export function sortFilterOptions(
	options: { label: string; value: string }[],
	appliedOptionValues: string[]
): {
	label: string;
	value: string;
}[] {
	return sortBy(
		options,
		(filterOption) =>
			// Sort checked options first
			(appliedOptionValues.includes(filterOption.value) ? '0' : '1') +
			// Sort letters, then numbers, then symbols
			getCharacterType(filterOption.label[0]) +
			// Then sort by lowercase label
			filterOption.label.toLowerCase()
	);
}
