import { Options } from 'openseadragon';

export function getOpenSeadragonConfig(isMobile: boolean, id: string): Options {
	return {
		id,

		tileSources: [
			{
				type: 'image',
				url: 'https://assets-qas.hetarchief.be/hetarchief/BERT_TEST_IIIF_VIEWER/german.jpg',
			},
			{
				type: 'image',
				url: 'https://assets-qas.hetarchief.be/hetarchief/BERT_TEST_IIIF_VIEWER/volksgazet.png',
			},
			'https://ids.lib.harvard.edu/ids/iiif/47174896/info.json',
			'https://ids.lib.harvard.edu/ids/iiif/18737483/info.json',
			'https://ids.lib.harvard.edu/ids/iiif/47174892/info.json',
			'https://ids.lib.harvard.edu/ids/iiif/43182083/info.json',
			'https://ids.lib.harvard.edu/ids/iiif/43183405/info.json',
			'https://ids.lib.harvard.edu/ids/iiif/43183422/info.json',
		],
		loadTilesWithAjax: true,

		// preserveViewport: true,
		defaultZoomLevel: 0.5,
		minZoomLevel: 0.3,
		maxZoomLevel: 5,

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
		navigatorHeight: '150px',
		navigatorWidth: '120px',

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
