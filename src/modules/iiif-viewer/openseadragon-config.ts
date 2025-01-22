import { type Options } from 'openseadragon';

export function getOpenSeadragonConfig(
	tileSources: (string | { type: 'image'; url: string })[],
	isMobile: boolean,
	id: string,
	token: string
): Options {
	return {
		id,

		tileSources,
		loadTilesWithAjax: true,
		// https://openseadragon.github.io/docs/OpenSeadragon.html#:~:text=A%20set%20of%20headers%20to%20include%20when%20making%20AJAX%20requests%20for%20tile%20sources%20or%20tiles.
		ajaxHeaders: {
			Authorization: 'Bearer ' + token,
		},

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
