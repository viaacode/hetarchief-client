import type { MediaActions } from '@ie-objects/ie-objects.types';
import type { HetArchiefIeObject } from '@viaa/avo2-types';

export interface ObjectDetailPageHeaderProps {
	mediaInfo: HetArchiefIeObject | null | undefined;
	onClickAction: (id: MediaActions) => Promise<void>;
	hasAccessToVisitorSpaceOfObject: boolean;
	currentPageIndex: number;
	/**
	 * Whether the "beperkte header" (compact, title-only) state is shown.
	 * Owned by the parent so it can share the scroll container + sentinel that drives it.
	 */
	isCollapsed: boolean;
	onShowDetails: () => void;
}
