import { Folder } from '@account/types';

export function createFolderSlug(collection: Pick<Folder, 'id' | 'name' | 'isDefault'>): string {
	if (!collection.name) {
		return '';
	}

	const uuidPart = collection.id.split('-', 1)[0];

	return encodeURIComponent(
		`${collection.name.toLowerCase().replaceAll(' ', '-')}` +
			(!collection.isDefault && uuidPart.length >= 1 ? `--${uuidPart}` : ``)
	);
}
