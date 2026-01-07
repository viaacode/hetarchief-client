/**
 * Filter query params are tracked under: VisitorSpaceFilterId
 * Other query params are tracked under QUERY_PARAM_KEY
 */
export enum QUERY_PARAM_KEY {
	SHOW_AUTH_QUERY_KEY = 'showAuth',
	VISITOR_SPACE_SLUG_QUERY_KEY = 'bezoekersruimte',
	SEARCH_QUERY_KEY = 'zoekterm',
	REDIRECT_TO_QUERY_KEY = 'redirectTo',
	HIGHLIGHTED_SEARCH_TERMS = 'searchTerms',
	ACTIVE_BLADE = 'blade',
	ACTIVE_TAB = 'tab',
	IIIF_VIEWER_FOCUS_X = 'focusX',
	IIIF_VIEWER_FOCUS_Y = 'focusY',
	IIIF_VIEWER_ZOOM_LEVEL = 'zoomLevel',
	ACTIVE_PAGE = 'activePage',
	ACTIVE_REPRESENTATION = 'activeRepresentation',
	EXPAND_SIDEBAR = 'expandSidebar',
	IIIF_VIEWER_TEXT_OVERLAY_ENABLED = 'textOverlay',
	CONTENT_PAGE_PREVIEW = 'preview',
	CUE_POINTS = 'cuepoints',

	TYPE_QUERY_KEY = 'type',
	STATUS_QUERY_KEY = 'status',
	HAS_DOWNLOAD_URL_QUERY_KEY = 'hasDownloadUrl',
	ORDER_PROP_QUERY_KEY = 'orderProp',
	ORDER_DIRECTION_QUERY_KEY = 'orderDirection',
	PAGE_QUERY_KEY = 'page',
}

export const HIGHLIGHTED_SEARCH_TERMS_SEPARATOR = ',';
export const CUE_POINTS_SEPARATOR = ',';
