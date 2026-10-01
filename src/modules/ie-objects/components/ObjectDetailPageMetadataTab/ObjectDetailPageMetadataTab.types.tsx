import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import type { SimplifiedAlto, TextLine } from '@iiif-viewer/IiifViewer.types';
import type {
	HetArchiefIeObject,
	HetArchiefIeObjectFile,
	HetArchiefIeObjectPage,
} from '@viaa/avo2-types';

export interface ObjectDetailPageMetadataTabProps {
	mediaInfo: HetArchiefIeObject | null | undefined;
	goToPage: (pageIndex: number) => void;
	currentPage: HetArchiefIeObjectPage | null;
	activeFile: HetArchiefIeObjectFile | null;
	simplifiedAltoInfo: SimplifiedAlto | null;
	iiifZoomTo: (x: number, y: number) => void;
	setActiveMentionHighlights: (mentionHighlights: {
		pageIndex: number;
		highlights: TextLine[];
	}) => void;
	setIsTextOverlayVisible: (visible: boolean) => void;
	/** Opens the shared "read more" metadata field blade; owned by the parent so the header and
	 * the metadata tab share a single blade instead of each having their own. */
	onReadMoreClicked: (item: MetadataItem) => void;
}
