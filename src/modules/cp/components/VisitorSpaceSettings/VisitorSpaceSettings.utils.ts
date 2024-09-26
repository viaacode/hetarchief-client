import { ValidationError } from 'yup';

import { tText } from '@shared/helpers/translate';

export const checkFileSize = (file?: File): boolean => {
	let valid = true;

	if (file) {
		const size = file.size / 1024;
		if (size > 500) {
			valid = false;
		}
	}

	return valid;
};

export const checkFileType = (file?: File): boolean => {
	let valid = true;

	if (file) {
		if (!['image/jpeg', 'image/png'].includes(file.type)) {
			valid = false;
		}
	}
	return valid;
};

export function validateFile(file: File | null | undefined): void {
	if (!file) {
		return;
	}
	if (!checkFileSize(file)) {
		throw new ValidationError(
			tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestand-is-te-groot-max-500-kb'
			),
			undefined,
			'file'
		);
	}
	if (!checkFileType(file)) {
		throw new ValidationError(
			tText(
				'modules/cp/components/visitor-space-settings/visitor-space-settings___bestandstype-is-niet-toegestaan-jpg-png'
			),
			undefined,
			'file'
		);
	}
}
