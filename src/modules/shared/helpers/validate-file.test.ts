import {
	getFileExtension,
	isFileTypeAllowed,
	isSizeWithinLimit,
	validateFile,
} from '@shared/helpers/validate-file';
import { describe, expect, it } from 'vitest';

/** Build a File of an exact byte size, so the 500 kb boundary can be tested precisely */
const makeFile = (sizeInKb: number, type: string, name = 'thumbnail'): File =>
	new File([new Uint8Array(sizeInKb * 1024)], name, { type });

describe('validateFile()', () => {
	it('accepts nothing being uploaded', () => {
		expect(validateFile(null)).toBeNull();
		expect(validateFile(undefined)).toBeNull();
	});

	it('accepts a jpeg and a png within the size limit', () => {
		expect(validateFile(makeFile(100, 'image/jpeg'))).toBeNull();
		expect(validateFile(makeFile(100, 'image/png'))).toBeNull();
	});

	it('accepts a file of exactly 500 kb', () => {
		expect(validateFile(makeFile(500, 'image/png'))).toBeNull();
	});

	it('rejects a file over 500 kb', () => {
		expect(validateFile(makeFile(501, 'image/png'))).toHaveProperty('file');
	});

	it('rejects disallowed types, even when small', () => {
		for (const type of ['image/gif', 'image/webp', 'application/pdf', 'image/svg+xml']) {
			expect(validateFile(makeFile(10, type)), `expected ${type} to be rejected`).toHaveProperty(
				'file'
			);
		}
	});

	it('rejects a file that fails both size and type', () => {
		// Which of the two messages wins is not asserted: translations resolve to empty strings in
		// tests, so the messages are indistinguishable here
		expect(validateFile(makeFile(600, 'image/gif'))).toHaveProperty('file');
	});

	it('honours an overridden size limit', () => {
		expect(validateFile(makeFile(900, 'image/png'), { maxFileSizeKb: 1000 })).toBeNull();
		expect(validateFile(makeFile(300, 'image/png'), { maxFileSizeKb: 100 })).toHaveProperty('file');
	});

	it('honours an overridden mime type list', () => {
		expect(
			validateFile(makeFile(10, 'image/webp'), { allowedMimeTypes: ['image/webp'] })
		).toBeNull();
		expect(
			validateFile(makeFile(10, 'image/png'), { allowedMimeTypes: ['image/webp'] })
		).toHaveProperty('file');
	});

	it('accepts a file whose extension is allowed even when its mime type is not', () => {
		// Browsers report .doc and .xls inconsistently, which is why the extension list exists
		expect(
			validateFile(makeFile(10, '', 'aanvraag.doc'), {
				allowedMimeTypes: [],
				allowedExtensions: ['.doc'],
			})
		).toBeNull();
	});
});

describe('getFileExtension()', () => {
	it('returns the lowercased extension including the dot', () => {
		expect(getFileExtension(makeFile(1, '', 'Aanvraag.PDF'))).toBe('.pdf');
		expect(getFileExtension(makeFile(1, '', 'archive.tar.gz'))).toBe('.gz');
	});

	it('returns null for a name without an extension', () => {
		expect(getFileExtension(makeFile(1, '', 'README'))).toBeNull();
	});
});

describe('isFileTypeAllowed()', () => {
	it('matches on either the mime type or the extension', () => {
		const file = makeFile(1, 'image/png', 'foto.png');

		expect(isFileTypeAllowed(file, { allowedMimeTypes: ['image/png'] })).toBe(true);
		expect(isFileTypeAllowed(file, { allowedExtensions: ['.png'] })).toBe(true);
		expect(isFileTypeAllowed(file, { allowedMimeTypes: ['image/jpeg'] })).toBe(false);
	});

	it('rejects everything when no list is given', () => {
		expect(isFileTypeAllowed(makeFile(1, 'image/png', 'foto.png'))).toBe(false);
	});
});

describe('isSizeWithinLimit()', () => {
	it('compares a byte total against a limit in kilobytes', () => {
		// The attachment budget in MessageFileUpload is a running total, not a per-file size
		expect(isSizeWithinLimit(25 * 1024 * 1024, 25 * 1024)).toBe(true);
		expect(isSizeWithinLimit(25 * 1024 * 1024 + 1, 25 * 1024)).toBe(false);
	});
});
