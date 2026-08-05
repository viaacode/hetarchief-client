import { tText } from '@shared/helpers/translate';

/** Defaults of {@link validateFile}: the rules for visitor space images and theme thumbnails */
export const DEFAULT_MAX_FILE_SIZE_KB = 500;
export const DEFAULT_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

export interface FileTypeOptions {
	/** Mime types the file is allowed to have, as reported by the browser */
	allowedMimeTypes?: string[];
	/**
	 * Extensions the file name is allowed to end in, including the dot. Use for types the browser
	 * reports unreliably, such as .doc and .xls. A file passes when it matches either list.
	 */
	allowedExtensions?: string[];
}

export interface ValidateFileOptions extends FileTypeOptions {
	/** Maximum file size in kilobytes */
	maxFileSizeKb?: number;
}

/** The file name extension, lowercased and including the dot, or null when there is none */
export const getFileExtension = (file: File): string | null => {
	const parts = file.name.split('.');
	return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : null;
};

/** For callers that check a running total across several files instead of one file on its own */
export const isSizeWithinLimit = (sizeInBytes: number, maxSizeKb: number): boolean =>
	sizeInBytes / 1024 <= maxSizeKb;

export const isFileSizeAllowed = (file: File, maxFileSizeKb: number): boolean =>
	isSizeWithinLimit(file.size, maxFileSizeKb);

export const isFileTypeAllowed = (
	file: File,
	{ allowedMimeTypes = [], allowedExtensions = [] }: FileTypeOptions = {}
): boolean => {
	if (allowedMimeTypes.includes(file.type)) {
		return true;
	}
	const extension = getFileExtension(file);
	return !!extension && allowedExtensions.includes(extension);
};

/**
 * Validate an uploaded image against a size and a type limit, defaulting to max 500 kb and jpg or
 * png. Callers that report their own message, such as MessageFileUpload, use
 * {@link isFileSizeAllowed} and {@link isFileTypeAllowed} directly instead.
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
		allowedExtensions,
	}: ValidateFileOptions = {}
): null | Record<string, string> {
	if (!file) {
		return null;
	}
	if (!isFileSizeAllowed(file, maxFileSizeKb)) {
		return {
			file: tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestand-is-te-groot-max-500-kb'
			),
		};
	}
	if (!isFileTypeAllowed(file, { allowedMimeTypes, allowedExtensions })) {
		return {
			file: tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestandstype-is-niet-toegestaan-jpg-png'
			),
		};
	}
	return null;
}
