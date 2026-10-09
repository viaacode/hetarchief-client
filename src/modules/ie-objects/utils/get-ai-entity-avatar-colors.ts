import { Color } from '@meemoo/admin-core-ui/admin';

// The tertiary background colours and the text colour that is WCAG-approved on each of them.
// Mirrors react-admin-core-module: content-page/const/background-text-colors.ts ("primary" role),
// which is not exported from @meemoo/admin-core-ui.
export const AI_ENTITY_AVATAR_COLORS: { background: string; text: string }[] = [
	{ background: Color.OldPink, text: Color.White },
	{ background: Color.Lavender, text: Color.Black },
	{ background: Color.Lila, text: Color.Black },
	{ background: Color.BlossomPink, text: Color.Black },
	{ background: Color.Coral, text: Color.Black },
	{ background: Color.BabyBlue, text: Color.Black },
	{ background: Color.Sage, text: Color.Black },
	{ background: Color.Pistachio, text: Color.Black },
	{ background: Color.SandBeige, text: Color.Black },
	{ background: Color.Mustard, text: Color.Black },
];

// A hash instead of Math.random(): the same person keeps the same colour across renders
export const getAiEntityAvatarColors = (name: string): { background: string; text: string } => {
	let hash = 5381;
	for (const char of name) {
		hash = (hash * 33 + (char.codePointAt(0) ?? 0)) % 2147483647;
	}
	return AI_ENTITY_AVATAR_COLORS[hash % AI_ENTITY_AVATAR_COLORS.length];
};

// Names can carry a disambiguating description, "Theo van Gogh (regisseur)", which is not part of the name.
const getNameWords = (name: string): string[] =>
	name
		.replace(/\([^)]*\)/g, ' ')
		.split(/\s+/)
		.filter((word) => /^[\p{L}\p{N}]/u.test(word));

// First letters of the first and last word ("Jane Eve Doe" -> "JD"); a single word gives its first two letters.
export const getAiEntityInitials = (name: string): string => {
	const words = getNameWords(name);
	if (words.length <= 1) {
		return (words[0] ?? '').substring(0, 2).toUpperCase();
	}
	return (words[0].substring(0, 1) + words[words.length - 1].substring(0, 1)).toUpperCase();
};

// First letter of the name ("Sint Lucas Gent" -> "S")
export const getAiEntityFirstLetter = (name: string): string =>
	(getNameWords(name)[0] ?? '').substring(0, 1).toUpperCase();
