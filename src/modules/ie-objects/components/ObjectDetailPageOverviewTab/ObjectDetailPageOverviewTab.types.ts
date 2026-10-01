import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import type { MediaObject } from '@ie-objects/components/RelatedObject';
import type { VisitRequest } from '@shared/types/visit-request';
import type { HetArchiefIeObject } from '@viaa/avo2-types';

export interface ObjectDetailPageOverviewTabProps {
	mediaInfo: HetArchiefIeObject | null | undefined;
	visitRequest: VisitRequest | null;
	similar: MediaObject[];
	/** Opens the shared "read more" metadata field blade; owned by the page so the header, this
	 * tab and the metadata tab all share a single blade instead of each having their own. */
	onReadMoreClicked: (item: MetadataItem) => void;
}
