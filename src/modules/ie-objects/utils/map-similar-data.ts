import type { MediaObject } from '@ie-objects/components/RelatedObject';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import { isNil } from 'es-toolkit/compat';

/**
 * Map the ie objects returned by the 'also interesting' endpoint to the shape
 * the RelatedObject card component expects.
 */
export const mapSimilarData = (data: Partial<HetArchiefIeObject>[]): MediaObject[] => {
	return data.map((ieObject) => {
		const date = ieObject.datePublished ?? ieObject.dateCreated ?? null;

		return {
			type: ieObject?.dctermsFormat || null,
			title: ieObject?.name || '',
			subtitle: isNil(date)
				? `${ieObject?.maintainerName ?? ''}`
				: `${ieObject?.maintainerName ?? ''} (${date})`,
			description: ieObject?.description || '',
			thumbnail: ieObject?.thumbnailUrl,
			hasAccessToEssence: !!ieObject?.hasAccessToEssence,
			id: ieObject?.schemaIdentifier || '',
			maintainer_id: ieObject?.maintainerId || '',
		};
	});
};
