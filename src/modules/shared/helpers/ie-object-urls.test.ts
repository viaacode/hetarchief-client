import { Locale } from '@shared/utils/i18n';
import { describe, expect, it } from 'vitest';
import {
	getAbsoluteUrl,
	getIeObjectDetailPath,
	getIeObjectNameSlug,
	getLocalePathPrefix,
	IE_OBJECT_NAME_SLUG_FALLBACK,
} from './ie-object-urls';

describe('getIeObjectNameSlug', () => {
	it('kebab cases the title and replaces special characters with dashes', () => {
		expect(getIeObjectNameSlug('Belgischer Kurier: belgische Ausgabe des Deutschen Kurier')).toBe(
			'belgischer-kurier-belgische-ausgabe-des-deutschen-kurier'
		);
		expect(getIeObjectNameSlug('De Oorlog — 1914/1918 (nr. 3)')).toBe('de-oorlog-1914-1918-nr-3');
	});

	it('strips accents, so the slug matches the one in the sitemap', () => {
		expect(getIeObjectNameSlug("L'Écho de Belgique")).toBe('l-echo-de-belgique');
		expect(getIeObjectNameSlug('Het Volk, 12 août 1917')).toBe('het-volk-12-aout-1917');
		expect(getIeObjectNameSlug('Größe & Straße')).toBe('grosse-strasse');
	});

	it('produces the same slug as the sitemap generator in hetarchief-proxy', () => {
		// hetarchief-proxy builds the sitemap with lodash' kebabCase (see sitemap.service.ts).
		// The expected values below are that function's output. If these ever diverge, every url
		// in the sitemap redirects to a different url, which search engines flag as an error.
		const lodashKebabCaseOutput: [string, string][] = [
			["L'Écho de Belgique", 'l-echo-de-belgique'],
			['Het Volk, 12 août 1917', 'het-volk-12-aout-1917'],
			['Größe & Straße', 'grosse-strasse'],
			['Ça ira', 'ca-ira'],
			[
				'Belgischer Kurier: belgische Ausgabe des Deutschen Kurier',
				'belgischer-kurier-belgische-ausgabe-des-deutschen-kurier',
			],
			['De Oorlog — 1914/1918 (nr. 3)', 'de-oorlog-1914-1918-nr-3'],
			['Vooruit: socialistisch dagblad', 'vooruit-socialistisch-dagblad'],
		];
		for (const [title, expected] of lodashKebabCaseOutput) {
			expect(getIeObjectNameSlug(title)).toBe(expected);
		}
	});

	it('falls back to a placeholder for empty or unusable titles', () => {
		expect(getIeObjectNameSlug(null)).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
		expect(getIeObjectNameSlug(undefined)).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
		expect(getIeObjectNameSlug('   ')).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
		expect(getIeObjectNameSlug('!!!')).toBe(IE_OBJECT_NAME_SLUG_FALLBACK);
	});

	it('is idempotent, so redirecting to a canonical url never loops', () => {
		const slug = getIeObjectNameSlug("L'Écho de Belgique");
		expect(getIeObjectNameSlug(slug)).toBe(slug);
	});
});

describe('getLocalePathPrefix', () => {
	it('omits the prefix for the default locale and adds it for the others', () => {
		expect(getLocalePathPrefix(Locale.nl)).toBe('');
		expect(getLocalePathPrefix(Locale.en)).toBe('/en');
	});
});

describe('getIeObjectDetailPath', () => {
	it('uses the localised search route part', () => {
		expect(getIeObjectDetailPath(Locale.nl, 'vrt', 'abc123', 'Het Journaal')).toBe(
			'/zoeken/vrt/abc123/het-journaal'
		);
		expect(getIeObjectDetailPath(Locale.en, 'vrt', 'abc123', 'Het Journaal')).toBe(
			'/search/vrt/abc123/het-journaal'
		);
	});
});

describe('getAbsoluteUrl', () => {
	it('prefixes the client url and only prefixes the locale for non default locales', () => {
		expect(getAbsoluteUrl(Locale.nl, '/zoeken/vrt/abc123/het-journaal')).toMatch(
			/\/zoeken\/vrt\/abc123\/het-journaal$/
		);
		expect(getAbsoluteUrl(Locale.nl, '/zoeken/x')).not.toContain('/nl/');
		expect(getAbsoluteUrl(Locale.en, '/search/x')).toContain('/en/search/x');
	});
});
