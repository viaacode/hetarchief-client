import { tText } from '@shared/helpers/translate';

/** Defaults of {@link validateFile}: the rules for visitor space images and theme thumbnails */
export const DEFAULT_MAX_FILE_SIZE_KB = 500;
export const DEFAULT_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

export interface ValidateFileOptions {
	/** Maximum file size in kilobytes */
	maxFileSizeKb?: number;
	/** Mime types the file is allowed to have, as reported by the browser */
	allowedMimeTypes?: string[];
}

const checkFileSize = (file: File, maxFileSizeKb: number): boolean =>
	file.size / 1024 <= maxFileSizeKb;

const checkFileType = (file: File, allowedMimeTypes: string[]): boolean =>
	allowedMimeTypes.includes(file.type);

/**
 * Validate an uploaded image against a size and a mime type limit, defaulting to max 500 kb and
 * jpg or png.
 *
 * Used for visitor space images and for theme thumbnails. The translation keys are deliberately
 * kept under the original visitor-space path: they already exist in the meemoo translations, and
 * renaming them would render these messages as "Label ***" until they are re-added. They also
 * spell out the default limits, so a caller that overrides those should pass its own messages
 * once such a caller exists.
 *
 * @returns null when valid, or a { file: message } record to merge into form errors
 */
export function validateFile(
	file: File | null | undefined,
	{
		maxFileSizeKb = DEFAULT_MAX_FILE_SIZE_KB,
		allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
	}: ValidateFileOptions = {}
): null | Record<string, string> {
	if (!file) {
		return null;
	}
	if (!checkFileSize(file, maxFileSizeKb)) {
		return {
			file: tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestand-is-te-groot-max-500-kb'
			),
		};
	}
	if (!checkFileType(file, allowedMimeTypes)) {
		return {
			file: tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestandstype-is-niet-toegestaan-jpg-png'
			),
		};
	}
	return null;
}
