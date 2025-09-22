import type { OcrSearchResult } from '@ie-objects/ie-objects.types';

export interface ImageInfo {
	thumbnailUrl?: string;
	imageUrl: string;
	altoUrl?: string;
}

export interface ImageInfoWithToken extends ImageInfo {
	token: string | null;
}

export interface ImageSize {
	width: number;
	height: number;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface IiifViewerProps {
	id: string;
	imageInfosWithTokens: ImageInfoWithToken[];
	isTextOverlayVisible: boolean;
	setIsTextOverlayVisible: (isOcrEnabled: boolean) => void;
	activeImageIndex: number;
	setActiveImageIndex: (newActiveImageIndex: number) => void;
	initialFocusX?: number;
	initialFocusY?: number;
	initialZoomLevel?: number;
	onInitialized: () => void;
	onPageChanged: (newPageIndex: number) => void;

	// Search through pages
	isSearchEnabled: boolean;
	searchTerms: string;
	setSearchTerms: (searchTerms: string) => void;
	onSearch: (searchTerms: string) => void;
	onClearSearch: () => void;
	currentSearchIndex: number;
	searchResults: OcrSearchResult[] | null;
	setSearchResultIndex: (newSearchIndex: number) => void;

	// Selection + download
	onSelection?: (rect: Rect, pageIndex: number) => void;
	enableSelection?: boolean;
}

export interface IiifViewerFunctions {
	iiifZoomToRect: (rect: Rect) => void;
	iiifZoomTo: (x: number, y: number) => void;
	iiifRotate: (rotateRight: boolean) => void;
	iiifFullscreen: (expand: boolean) => void;
	iiifZoom: (multiplier: number) => void;
	iiifGoToHome: () => void;
	iiifGoToPage: (pageIndex: number) => void;
	waitForReadyState: () => Promise<void>;
	updateHighlightedAltoTexts: (
		highlightedAltoTexts: TextLine[],
		selectedAltoText: TextLine | null
	) => void;
}

export interface TextLine {
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface SimplifiedAltoInfo {
	pageIndex: number;
	altoJsonUrl: string;
	altoJsonContent: SimplifiedAlto;
}

export interface SimplifiedAlto {
	description: {
		fileName: string | undefined;
		processingDateTime: string | undefined;
		processingStepSettings: string | undefined;
		softwareCreator: string | undefined;
		softwareName: string | undefined;
		softwareVersion: string | undefined;
		width: string | undefined;
		height: string | undefined;
	};
	text: TextLine[] | undefined;
}

export const HIGHLIGHT_MARGIN = 0.003;

export enum IiifViewerAction {
	IIIF_VIEWER_ZOOM_TO_RECT = 'IIIF_VIEWER_ZOOM_TO_RECT',
	IIIF_VIEWER_ROTATE = 'IIIF_VIEWER_ROTATE',
	IIIF_VIEWER_FULLSCREEN = 'IIIF_VIEWER_FULLSCREEN',
	IIIF_VIEWER_ZOOM = 'IIIF_VIEWER_ZOOM',
	IIIF_VIEWER_ZOOM_TO = 'IIIF_VIEWER_ZOOM_TO',
	IIIF_VIEWER_GO_TO_HOME = 'IIIF_VIEWER_GO_TO_HOME',
	IIIF_VIEWER_GO_TO_PAGE = 'IIIF_VIEWER_GO_TO_PAGE',
	IIIF_VIEWER_UPDATE_HIGHLIGHTED_ALTO_TEXTS = 'IIIF_VIEWER_UPDATE_HIGHLIGHTED_ALTO_TEXTS',
}

export interface IiifViewerZoomToRectEvent extends Event {
	functionProps: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

export interface IiifViewerRotateEvent extends Event {
	functionProps: {
		rotateRight: boolean;
	};
}

export interface IiifViewerFullscreenEvent extends Event {
	functionProps: { expand: boolean };
}

export interface IiifViewerZoomEvent extends Event {
	functionProps: {
		multiplier: number;
	};
}

export interface IiifViewerZoomToEvent extends Event {
	functionProps: {
		x: number;
		y: number;
	};
}

export interface IiifViewerGoToPageEvent extends Event {
	functionProps: {
		pageIndex: number;
	};
}

export interface IiifViewerUpdateHighlightedAltoTextsEvent extends Event {
	functionProps: {
		highlightedAltoTexts?: TextLine[];
		selectedAltoText?: TextLine | null;
		zoomToSelectedAltoText: boolean;
	};
}

export type IiifViewerEvent =
	| IiifViewerZoomToRectEvent
	| IiifViewerRotateEvent
	| IiifViewerFullscreenEvent
	| IiifViewerZoomEvent
	| IiifViewerZoomToEvent
	| IiifViewerGoToPageEvent
	| IiifViewerUpdateHighlightedAltoTextsEvent;
