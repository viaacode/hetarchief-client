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
}
