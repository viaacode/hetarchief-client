import { GetCollections } from '@account/types';

export const isInAFolder = (
	collections: GetCollections | undefined,
	schemaIdentifier?: string
): boolean => {
	if (!schemaIdentifier) {
		return false;
	}
	return (collections?.items || []).some((collection) => {
		return collection.objects?.find((object) => object.schemaIdentifier === schemaIdentifier);
	});
};
