// The tertiary background colours and the text colour that is WCAG-approved on each of them.
// Mirrors react-admin-core-module: content-page/const/background-text-colors.ts ("primary" role),
// which is not exported from @meemoo/admin-core-ui.
const WHITE = '#FFF';
const BLACK = '#000';

export const AI_ENTITY_AVATAR_COLORS: { background: string; text: string }[] = [
	{ background: '#9B6072', text: WHITE }, // OldPink
	{ background: '#A293AF', text: BLACK }, // Lavender
	{ background: '#c6c2e0', text: BLACK }, // Lila
	{ background: '#E694B3', text: BLACK }, // BlossomPink
	{ background: '#E89B88', text: BLACK }, // Coral
	{ background: '#BDDEE7', text: BLACK }, // BabyBlue
	{ background: '#91A9A7', text: BLACK }, // Sage
	{ background: '#B8BE9A', text: BLACK }, // Pistachio
	{ background: '#EDD6C4', text: BLACK }, // SandBeige
	{ background: '#EFCA6A', text: BLACK }, // Mustard
];

// A hash instead of Math.random(): the same person keeps the same colour across renders
export const getAiEntityAvatarColors = (name: string): { background: string; text: string } => {
	let hash = 5381;
	for (const char of name) {
		hash = (hash * 33 + (char.codePointAt(0) ?? 0)) % 2147483647;
	}
	return AI_ENTITY_AVATAR_COLORS[hash % AI_ENTITY_AVATAR_COLORS.length];
};

// First letters of the first and last word ("Jane Eve Doe" -> "JD"); a single word gives its first two letters.
// Names can carry a disambiguating description, "Theo van Gogh (regisseur)", which is not part of the name.
export const getAiEntityInitials = (name: string): string => {
	const words = name
		.replace(/\([^)]*\)/g, ' ')
		.split(/\s+/)
		.filter((word) => /^[\p{L}\p{N}]/u.test(word));
	if (words.length === 0) {
		return '';
	}
	if (words.length === 1) {
		return Array.from(words[0]).slice(0, 2).join('').toUpperCase();
	}
	return (Array.from(words[0])[0] + Array.from(words[words.length - 1])[0]).toUpperCase();
};
