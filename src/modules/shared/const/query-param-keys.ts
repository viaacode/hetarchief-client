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
}

export const HIGHLIGHTED_SEARCH_TERMS_SEPARATOR = ',';
