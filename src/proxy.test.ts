import { describe, expect, it } from 'vitest';
import { MEDIA_MOSA_ID_PATH_REGEX } from './proxy';

const MOSA_ID = 'DERjAWdlzOaUPIeUa8q4pCTj';

describe('MEDIA_MOSA_ID_PATH_REGEX', () => {
	it.each([
		[`/media/${MOSA_ID}`, undefined],
		[`/media/${MOSA_ID}/5`, undefined],
		[`/media/de-vlaamsche-smeder-nationalistenblad/${MOSA_ID}`, undefined],
		[`/media/de-vlaamsche-smeder-nationalistenblad/${MOSA_ID}/12`, undefined],
		[`/fr/media/la-flandre-lib%C3%A9rale/${MOSA_ID}/3`, 'fr'],
		[`/de/iframe/media/het-rood-kruis-belgi%C3%AF%C2%BF%C2%BD/${MOSA_ID}`, 'de'],
		[`/iframe/media/ons-vaderland/${MOSA_ID}`, undefined],
		[`/en/media/${MOSA_ID}`, 'en'],
	])('extracts the mosa id from %s', (path, locale) => {
		const match = path.match(MEDIA_MOSA_ID_PATH_REGEX);
		expect(match?.[1]).toBe(locale);
		expect(match?.[2]).toBe(MOSA_ID);
	});

	it.each(['/zoeken/vrt/abc123/media', '/media', '/media/', '/nl/zoeken'])('ignores %s', (path) => {
		expect(path.match(MEDIA_MOSA_ID_PATH_REGEX)).toBeNull();
	});
});
