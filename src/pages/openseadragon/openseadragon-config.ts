import { Options } from 'openseadragon';

export function getOpenSeadragonConfig(isMobile: boolean, id: string): Options {
	return {
		id,
		sequenceMode: true,
		tileSources: ['https://iiif.harvardartmuseums.org/manifests/object/299843'],
		defaultZoomLevel: 0,
		loadTilesWithAjax: true,
		navigatorTop: '100px',
		navigatorLeft: '40px',
		navigatorHeight: '200px',
		navigatorWidth: '260px',
		preserveViewport: true,
		referenceStripScroll: 'vertical',
		showFullPageControl: !isMobile,
		showNavigator: !isMobile,
		showReferenceStrip: true,
		visibilityRatio: 1,
		// window: {
		// 	allowClose: false,
		// 	allowMaximize: false,
		// 	defaultView: 'single',
		// 	hideWindowTitle: true,
		// 	allowTopMenuButton: false,
		// 	allowWindowSideBar: false,
		// },
		// windows: [
		// 	{
		// 		// manifestId:
		// 		// 'https://bertyhell.s3.eu-central-1.amazonaws.com/projects/iiif/manifest-iiif.json',
		// 		// manifestId:
		// 		// 'http://dms-data.stanford.edu/data/manifests/McLaughlin/bc788vp3448/manifest.json',
		// 		manifestId: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
		// 		maximized: true,
		// 	},
		// ],
		// language: 'nl',
		// thumbnailNavigation: {
		// 	defaultPosition: 'far-right',
		// 	displaySettings: true,
		// 	height: 130,
		// 	width: 100,
		// },
		// workspaceControlPanel: {
		// 	enabled: false,
		// },
		// selectedTheme: 'dark',
		// workspace: {
		// 	draggingEnabled: false,
		// 	allowNewWindows: false,
		// 	isWorkspaceAddVisible: false,
		// 	showZoomControls: false,
		// 	type: 'mosaic',
		// },
	};
}
