import { type Folder } from '@account/types';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { type Locale } from '@shared/utils/i18n';

export function createFolderSlug(
	folder: Pick<Folder, 'id' | 'name' | 'isDefault'>,
	locale: Locale
): string {
	if (!folder.name) {
		return '';
	}

	if (folder.isDefault) {
		return ROUTE_PARTS_BY_LOCALE[locale].favorites;
	}

	const uuidPart = folder.id.split('-', 1)[0];

	return encodeURIComponent(
		`${folder.name.toLowerCase().replaceAll(' ', '-')}` +
			(!folder.isDefault && uuidPart.length >= 1 ? `--${uuidPart}` : ``)
	);
}
