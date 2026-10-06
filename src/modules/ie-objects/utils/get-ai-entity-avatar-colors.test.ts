import { describe, expect, it } from 'vitest';

import {
	AI_ENTITY_AVATAR_COLORS,
	getAiEntityAvatarColors,
	getAiEntityInitials,
} from './get-ai-entity-avatar-colors';

describe('getAiEntityAvatarColors', () => {
	it('returns the same colours for the same name', () => {
		expect(getAiEntityAvatarColors('Jane Doe')).toEqual(getAiEntityAvatarColors('Jane Doe'));
	});

	it('always returns one of the tertiary colours', () => {
		for (const name of ['Jane Doe', 'Marjolein De Wilde', 'A', 'Zoë Ünal']) {
			expect(AI_ENTITY_AVATAR_COLORS).toContain(getAiEntityAvatarColors(name));
		}
	});

	it('uses white text only on the dark OldPink background', () => {
		for (const { background, text } of AI_ENTITY_AVATAR_COLORS) {
			expect(text).toBe(background === '#9B6072' ? '#FFF' : '#000');
		}
	});
});

describe('getAiEntityInitials', () => {
	it('takes the first letter of the first and last word', () => {
		expect(getAiEntityInitials('Jane Eve Doe')).toBe('JD');
		expect(getAiEntityInitials('marjolein de wilde')).toBe('MW');
	});

	it('takes the first two letters of a single word', () => {
		expect(getAiEntityInitials('Madonna')).toBe('MA');
	});

	it('ignores a description between brackets', () => {
		expect(getAiEntityInitials('Theo van Gogh (regisseur)')).toBe('TG');
		expect(getAiEntityInitials('Theo (regisseur) van Gogh')).toBe('TG');
		expect(getAiEntityInitials('Madonna (zangeres)')).toBe('MA');
	});

	it('skips words that do not start with a letter or digit', () => {
		expect(getAiEntityInitials('Jane - Doe')).toBe('JD');
		expect(getAiEntityInitials('(onbekend)')).toBe('');
	});

	it('copes with extra whitespace and empty names', () => {
		expect(getAiEntityInitials('  Jane   Doe ')).toBe('JD');
		expect(getAiEntityInitials('   ')).toBe('');
	});
});
