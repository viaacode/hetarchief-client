import type {
	IeObject,
	IeObjectFile,
	IeObjectPage,
	MediaActions,
} from '@ie-objects/ie-objects.types';
import type { SimplifiedAlto, TextLine } from '@iiif-viewer/IiifViewer.types';
import type { VisitRequest } from '@shared/types/visit-request';

export interface ObjectDetailPageMetadataProps {
	mediaInfo: IeObject | null | undefined;
	currentPageIndex: number;
	goToPage: (pageIndex: number) => void;
	currentPage: IeObjectPage | null;
	hasAccessToVisitorSpaceOfObject: boolean;
	showVisitButton: boolean;
	visitRequest: VisitRequest | null;
	activeFile: IeObjectFile | null;
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
