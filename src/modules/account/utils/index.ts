import { Collection } from '@account/types';

export function createCollectionSlug(
	collection: Pick<Collection, 'id' | 'name' | 'isDefault'>
): string {
	const uuidPart = collection.id.split('-', 1)[0];

	return encodeURIComponent(
		`${collection.name.toLowerCase().replaceAll(' ', '-')}` +
			(!collection.isDefault && uuidPart.length >= 1 ? `--${uuidPart}` : ``)
	);
}
