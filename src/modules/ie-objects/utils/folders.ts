import type { Folder } from '@account/types';

export const isInAFolder = (folders: Folder[] | undefined, schemaIdentifier?: string): boolean => {
	if (!schemaIdentifier) {
		return false;
	}
	return (folders || []).some((collection) => {
		return collection.objects?.find((object) => object.schemaIdentifier === schemaIdentifier);
	});
};
