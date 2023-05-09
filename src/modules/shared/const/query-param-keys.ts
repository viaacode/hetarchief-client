/**
 * Filter query params are tracked under: VisitorSpaceFilterId
 * Other query params are tracked under QUERY_PARAM_KEY
 */
export enum QUERY_PARAM_KEY {
	LAST_CLICKED_ITEM = 'lastClickedItem',
	SHOW_AUTH_QUERY_KEY = 'showAuth',
	VISITOR_SPACE_SLUG_QUERY_KEY = 'bezoekersruimte',
	SEARCH_QUERY_KEY = 'zoekterm',
	REDIRECT_TO_QUERY_KEY = 'redirectTo',
	HIGHLIGHTED_SEARCH_TERMS = 'searchTerms',
}
