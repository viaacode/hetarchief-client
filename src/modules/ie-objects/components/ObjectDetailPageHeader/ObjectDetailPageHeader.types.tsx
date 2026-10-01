import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import type { MediaActions } from '@ie-objects/ie-objects.types';
import type { HetArchiefIeObject } from '@viaa/avo2-types';

export interface ObjectDetailPageHeaderProps {
	mediaInfo: HetArchiefIeObject | null | undefined;
	onClickAction: (id: MediaActions) => Promise<void>;
	hasAccessToVisitorSpaceOfObject: boolean;
	currentPageIndex: number;
	/** Whether the compact ("beperkte header") state is shown; owned by the parent's scroll observer */
	isCollapsed: boolean;
	onShowDetails: () => void;
	/** Opens the shared "read more" metadata field blade; owned by the parent so the header and
	 * the metadata tab share a single blade instead of each having their own. */
	onReadMoreClicked: (item: MetadataItem) => void;
}
