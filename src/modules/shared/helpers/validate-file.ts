import { tText } from '@shared/helpers/translate';

const MAX_FILE_SIZE_KB = 500;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

const checkFileSize = (file?: File): boolean => {
	let valid = true;

	if (file) {
		const size = file.size / 1024;
		if (size > MAX_FILE_SIZE_KB) {
			valid = false;
		}
	}

	return valid;
};

const checkFileType = (file?: File): boolean => {
	let valid = true;

	if (file) {
		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			valid = false;
		}
	}
	return valid;
};

/**
 * Validate an uploaded image: max 500 kb, jpg or png only.
 *
 * Used for visitor space images and for theme thumbnails. The translation keys are deliberately
 * kept under the original visitor-space path: they already exist in the meemoo translations, and
 * renaming them would render these messages as "Label ***" until they are re-added.
 *
 * @returns null when valid, or a { file: message } record to merge into form errors
 */
export function validateFile(file: File | null | undefined): null | Record<string, string> {
	if (!file) {
		return null;
	}
	if (!checkFileSize(file)) {
		return {
			file: tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestand-is-te-groot-max-500-kb'
			),
		};
	}
	if (!checkFileType(file)) {
		return {
			file: tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestandstype-is-niet-toegestaan-jpg-png'
			),
		};
	}
	return null;
}
