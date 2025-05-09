import type { Options, TiledImageOptions } from 'openseadragon';

export function getOpenSeadragonConfig(
	tileSources: TiledImageOptions[],
	isMobile: boolean,
	id: string
): Options {
	return {
		id,

		tileSources,

		// Reduce loading time by loading less detailed tiles for a certain zoom level
		minPixelRatio: 1.5,

		// preserveViewport: true,
		defaultZoomLevel: isMobile ? 0.9 : 0.5,
		minZoomLevel: 0.3,
		maxZoomLevel: 100,

		// Panning
		visibilityRatio: 0.5,
		constrainDuringPan: true,
		homeFillsViewer: true,

		// controls
		autoHideControls: false,
		showFullPageControl: false,
		showNavigationControl: false,
		showZoomControl: false,
		showHomeControl: false,
		showRotationControl: false,
		showFlipControl: false,
		showSequenceControl: false,
		navPrevNextWrap: true,

		// Navigator
		showNavigator: !isMobile,
		navigatorPosition: 'BOTTOM_LEFT',
		navigatorHeight: '130px',
		navigatorWidth: '100px',

		// Reference strip
		sequenceMode: true,
		showReferenceStrip: false,
		// referenceStripScroll: 'vertical',
		// referenceStripPosition: 'TOP_RIGHT',
		// referenceStripSizeRatio: 0.1,
		// referenceStripHeight: 700,
		// referenceStripWidth: 120,

		// // Collection mode
		// collectionMode: true,
		// collectionRows: 3,
		// collectionTileSize: 1024,
		// collectionTileMargin: 256,
		// collectionLayout: 'vertical',
	} as Options;
}
