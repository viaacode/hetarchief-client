import { type AltoTextLine, type OcrSearchResult } from '@ie-objects/ie-objects.types';

export interface ImageInfo {
	thumbnailUrl: string;
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
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;

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
	onSelection?: (rect: Rect) => void;
	enableSelection?: boolean;
}

export interface IiifViewerFunctions {
	iiifZoomToRect: (rect: Rect) => void;
	iiifZoomTo: (x: number, y: number) => void;
	iiifRotate: (rotateRight: boolean) => void;
	iiifFullscreen: (expand: boolean) => void;
	iiifZoom: (multiplier: number) => void;
	iiifGoToHome: () => void;
	waitForReadyState: () => Promise<void>;
	updateHighlightedAltoTexts: (
		highlightedAltoTexts: AltoTextLine[],
		selectedAltoText: AltoTextLine | null
	) => void;
}

export interface TextLine {
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
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
