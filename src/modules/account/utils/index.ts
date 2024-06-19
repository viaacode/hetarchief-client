import { type Folder } from '@account/types';

export function createFolderSlug(folder: Pick<Folder, 'id' | 'name' | 'isDefault'>): string {
	if (!folder.name) {
		return '';
	}

	if (folder.isDefault) {
		return '';
	}

	const uuidPart = folder.id.split('-', 1)[0];

	return encodeURIComponent(
		`${folder.name.toLowerCase().replaceAll(' ', '-')}` +
			(!folder.isDefault && uuidPart.length >= 1 ? `--${uuidPart}` : ``)
	);
}
