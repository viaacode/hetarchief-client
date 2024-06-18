export type ImageInfo = {
	thumbnailUrl: string;
	altoUrl?: string;
	width: number;
	height: number;
} & (
	| {
			imageUrl: string;
	  }
	| {
			imageApiInfo: string;
	  }
);

export interface IiifViewerProps {
	id: string;
	imageInfos: ImageInfo[];
	isOcrEnabled: boolean;
	setIsOcrEnabled: (isOcrEnabled: boolean) => void;
	activeImageIndex: number;
	setActiveImageIndex: (newActiveImageIndex: number) => void;
}

export interface IiifViewerFunctions {
	iiifZoomToRect: (rect: { x: number; y: number; width: number; height: number }) => void;
	setActiveWordIndex: (wordIndex: number) => void;
	clearActiveWordIndex: () => void;
	iiifRotate: (rotateRight: boolean) => void;
	iiifGoToPage: (pageIndex: number) => void;
	iiifFullscreen: (expand: boolean) => void;
	iiifZoom: (multiplier: number) => void;
}
