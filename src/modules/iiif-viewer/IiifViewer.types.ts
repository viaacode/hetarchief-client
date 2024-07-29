import { type OcrSearchResult } from '@ie-objects/ie-objects.types';

export type ImageInfo = {
	thumbnailUrl: string;
	imageUrl: string;
};

export interface IiifViewerProps {
	id: string;
	imageInfos: ImageInfo[];
	altoJsonCurrentPage: SimplifiedAlto | null | undefined;
	isOcrEnabled: boolean;
	setIsOcrEnabled: (isOcrEnabled: boolean) => void;
	activeImageIndex: number;
	setActiveImageIndex: (newActiveImageIndex: number) => void;
	initialFocusX?: number;
	initialFocusY?: number;
	initialZoomLevel?: number;

	// Search through pages
	searchTerms: string;
	setSearchTerms: (searchTerms: string) => void;
	onSearch: (searchTerms: string) => void;
	onClearSearch: () => void;
	currentSearchIndex: number;
	searchResults: OcrSearchResult[] | null;
	setSearchResultIndex: (newSearchIndex: number) => void;
}

export interface IiifViewerFunctions {
	iiifZoomToRect: (rect: { x: number; y: number; width: number; height: number }) => void;
	setActiveWordIndex: (wordIndex: number) => void;
	clearActiveWordIndex: () => void;
	iiifRotate: (rotateRight: boolean) => void;
	iiifFullscreen: (expand: boolean) => void;
	iiifZoom: (multiplier: number) => void;
	iiifGoToHome: () => void;
	waitForReadyState: () => Promise<void>;
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
	};
	text: TextLine[] | undefined;
}
