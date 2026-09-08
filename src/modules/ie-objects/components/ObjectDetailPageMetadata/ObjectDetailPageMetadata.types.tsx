import type { MediaActions } from '@ie-objects/ie-objects.types';
import type { SimplifiedAlto, TextLine } from '@iiif-viewer/IiifViewer.types';
import type { VisitRequest } from '@shared/types/visit-request';
import type {
	HetArchiefIeObject,
	HetArchiefIeObjectFile,
	HetArchiefIeObjectPage,
} from '@viaa/avo2-types';

export interface ObjectDetailPageMetadataProps {
	mediaInfo: HetArchiefIeObject | null | undefined;
	currentPageIndex: number;
	goToPage: (pageIndex: number) => void;
	currentPage: HetArchiefIeObjectPage | null;
	hasAccessToVisitorSpaceOfObject: boolean;
	showVisitButton: boolean;
	visitRequest: VisitRequest | null;
	activeFile: HetArchiefIeObjectFile | null;
	simplifiedAltoInfo: SimplifiedAlto | null;
	onClickAction: (id: MediaActions) => Promise<void>;
	openRequestAccessBlade: () => void;
	iiifZoomTo: (x: number, y: number) => void;
	setActiveMentionHighlights: (mentionHighlights: {
		pageIndex: number;
		highlights: TextLine[];
	}) => void;
	setIsTextOverlayVisible: (visible: boolean) => void;
}
