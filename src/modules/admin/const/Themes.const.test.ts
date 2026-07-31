import { parseSchemaIdentifiers, THEME_VALIDATION_SCHEMA } from '@admin/const/Themes.const';
import { validateForm } from '@shared/helpers/validate-form';
import { describe, expect, it } from 'vitest';

const validTheme = {
	slug: 'culture-society',
	nameNl: 'Cultuur & samenleving',
	nameEn: 'Culture & society',
	descriptionNl: null,
	descriptionEn: null,
	contentPagePathNl: null,
	contentPagePathEn: null,
};

const validate = (overrides: Record<string, unknown> = {}) =>
	validateForm({ ...validTheme, ...overrides }, THEME_VALIDATION_SCHEMA());

describe('parseSchemaIdentifiers()', () => {
	it('splits a comma separated list', async () => {
		expect(parseSchemaIdentifiers('rf5kh9m2,9c72bt4x')).toEqual(['rf5kh9m2', '9c72bt4x']);
	});

	it('trims whitespace around each identifier', () => {
		expect(parseSchemaIdentifiers('  rf5kh9m2 , 9c72bt4x  ')).toEqual(['rf5kh9m2', '9c72bt4x']);
	});

	it('drops empty entries caused by stray commas', () => {
		expect(parseSchemaIdentifiers('rf5kh9m2,,9c72bt4x,')).toEqual(['rf5kh9m2', '9c72bt4x']);
	});

	it('de-duplicates while preserving entry order', () => {
		expect(parseSchemaIdentifiers('9c72bt4x, rf5kh9m2, 9c72bt4x')).toEqual([
			'9c72bt4x',
			'rf5kh9m2',
		]);
	});

	it('returns an empty list for empty or whitespace only input', () => {
		expect(parseSchemaIdentifiers('')).toEqual([]);
		expect(parseSchemaIdentifiers('   ')).toEqual([]);
		expect(parseSchemaIdentifiers(' , , ')).toEqual([]);
	});
});

describe('THEME_VALIDATION_SCHEMA', () => {
	it('accepts a valid theme', async () => {
		expect(await validate()).toBeNull();
	});

	it('requires slug, nameNl and nameEn', async () => {
		const errors = await validate({ slug: '', nameNl: '', nameEn: '' });

		expect(errors).not.toBeNull();
		expect(Object.keys(errors as Record<string, string>).sort()).toEqual([
			'nameEn',
			'nameNl',
			'slug',
		]);
	});

	it('rejects a slug with uppercase, spaces or other characters', async () => {
		for (const slug of ['Culture', 'culture society', 'culture_society', 'cultuur&samenleving']) {
			const errors = await validate({ slug });
			expect(errors, `expected "${slug}" to be rejected`).toHaveProperty('slug');
		}
	});

	it('accepts an internal path for the theme detail page', async () => {
		expect(await validate({ contentPagePathNl: '/themas/cultuur-samenleving' })).toBeNull();
	});

	it('rejects an absolute url or a path without a leading slash', async () => {
		for (const path of ['https://hetarchief.be/themas/x', 'themas/x', '/themas/met spatie']) {
			const errors = await validate({ contentPagePathNl: path });
			expect(errors, `expected "${path}" to be rejected`).toHaveProperty('contentPagePathNl');
		}
	});

	it('treats the detail page paths as optional', async () => {
		expect(await validate({ contentPagePathNl: '', contentPagePathEn: '' })).toBeNull();
		expect(await validate({ contentPagePathNl: null, contentPagePathEn: null })).toBeNull();
	});
});
