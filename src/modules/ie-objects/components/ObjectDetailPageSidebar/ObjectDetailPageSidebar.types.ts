import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import type { MediaObject } from '@ie-objects/components/RelatedObject';
import type { MediaActions, ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import type { ReactNode, RefObject } from 'react';

export interface ObjectDetailPageSidebarProps {
	mediaInfo: HetArchiefIeObject | null | undefined;
	onClickAction: (id: MediaActions) => Promise<void>;
	hasAccessToVisitorSpaceOfObject: boolean;
	currentPageIndex: number;
	onReadMoreClicked: (item: MetadataItem) => void;
	/** Drives the sticky content's own class names, and (once mobile rendering needs it - see the
	 * FA rework plan's Phase 6) which tab hides the header. */
	activeTab: ObjectDetailTabs;
	similar: MediaObject[];
	/** Desktop tabs, rendered inside the sticky header+tabs unit. Mobile renders its own tabs
	 * elsewhere on the page, so resolving which (if either) to pass here is left to the caller. */
	tabs: ReactNode;
	/** Exposed so the caller can also hand this same scrollable element to something else that
	 * needs it (e.g. ObjectDetailPageOcrTab's own scrollContainerRef). */
	containerRef: RefObject<HTMLDivElement | null>;
	/** Grid placement from the page that hosts the sidebar. */
	className?: string;
	children: ReactNode;
}
