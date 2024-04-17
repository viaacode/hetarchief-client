import { type MiradorConfig, Workspace } from '@shared/types/mirador/mirador.config';
import { type MiradorStore } from '@shared/types/mirador/mirador.store';

export interface MiradorLib {
	viewer(MiradorConfig, pluginsOrStruct: any): MiradorInstance;
	actions: Actions;
	reducers: Reducers;
	sagas: {
		default: {
			getRootSaga(): any;
		};
	};
	selectors: Selectors;
}

export interface MiradorInstance {
	config: MiradorConfig;
	container: HTMLElement;
	plugins: any[];
	root: ReactDomElement;
	store: MiradorStore;
}

export interface Actions {
	setWorkspaceFullscreen(): any;
	addAuthenticationRequest(windowId: any, id: any): any;
	addCompanionWindow(windowId: any, payload: any): any;
	addError(error: any): any;
	addOrUpdateCompanionWindow(windowId: any, payload: any): any;
	addResource(manifestId: any): any;
	addWindow(_ref: any): any;
	deselectAnnotation(windowId: any, annotationId: any): any;
	expandNodes(windowId: any, id: any, nodeIds: any): any;
	fetchInfoResponse(_ref: any): any;
	fetchManifest(manifestId: any, properties: any): any;
	fetchSearch(windowId: any, companionWindowId: any, searchId: any, query: any): any;
	focusWindow(windowId: any): any;
	hideCollectionDialog(windowId: any): any;
	hoverAnnotation(windowId: any, annotationIds: any): any;
	importConfig(config: any): any;
	importMiradorState(state: any): any;
	maximizeWindow(windowId: any, layout: any): any;
	minimizeWindow(windowId: any): any;
	receiveAccessToken(authId: any, serviceId: any, json: any): any;
	receiveAccessTokenFailure(authId: any, serviceId: any, error: any): any;
	receiveAnnotation(targetId: any, annotationId: any, annotationJson: any): any;
	receiveAnnotationFailure(targetId: any, annotationId: any, error: any): any;
	receiveDegradedInfoResponse(
		infoId: any,
		infoJson: any,
		ok: any,
		tokenServiceId: any,
		windowId: any
	): any;
	receiveInfoResponse(infoId: any, infoJson: any, ok: any, tokenServiceId: any): any;
	receiveInfoResponseFailure(infoId: any, error: any, tokenServiceId: any): any;
	receiveManifest(manifestId: any, manifestJson: any): any;
	receiveManifestFailure(manifestId: any, error: any): any;
	receiveSearch(windowId: any, companionWindowId: any, searchId: any, searchJson: any): any;
	receiveSearchFailure(windowId: any, companionWindowId: any, searchId: any, error: any): any;
	removeCompanionWindow(windowId: any, id: any): any;
	removeError(id: any): any;
	removeInfoResponse(infoId: any): any;
	removeManifest(manifestId: any): any;
	removeResource(manifestId: any): any;
	removeSearch(windowId: any, companionWindowId: any): any;
	removeWindow(windowId: any): any;
	requestAccessToken(serviceId: any, authId: any): any;
	requestAnnotation(targetId: any, annotationId: any): any;
	requestCanvasAnnotations(windowId: any, canvasId: any): any;
	requestInfoResponse(infoId: any, imageResource: any, windowId: any): any;
	requestManifest(manifestId: any, properties: any): any;
	requestSearch(windowId: any, companionWindowId: any, searchId: any, query: any): any;
	resetAuthenticationState(_ref: any): any;
	resolveAccessTokenRequest(authServiceId: any, tokenServiceId: any, json: any): any;
	resolveAuthenticationRequest(id: any, tokenServiceId: any, props: any): any;
	selectAnnotation(windowId: any, annotationId: any): any;
	setCanvas(windowId: any, canvasId: any): any;
	setCompanionAreaOpen(id: any, companionAreaOpen: any): any;
	setConfig(config: any): any;
	setContentSearchCurrentAnnotation(
		windowId: any,
		companionWindowId: any,
		annotationIds: any
	): any;
	setNextCanvas(windowId: any): any;
	setPreviousCanvas(windowId: any): any;
	setWindowThumbnailPosition(windowId: any, position: any): any;
	setWindowViewType(windowId: any, viewType: any): any;
	setWorkspaceAddVisibility(isWorkspaceAddVisible: any): any;
	setWorkspaceViewportDimensions(_ref2: any): any;
	setWorkspaceViewportPosition(_ref: any): any;
	showCollectionDialog(manifestId: any): any;
	toggleAnnotationDisplay(windowId: any): any;
	toggleDraggingEnabled(): any;
	toggleNode(windowId: any, id: any, nodeId: any): any;
	toggleWindowSideBar(windowId: any): any;
	toggleZoomControls(showZoomControls: any): any;
	updateCompanionWindow(windowId: any, id: any, payload: any): any;
	updateConfig(config: any): any;
	updateElasticWindowLayout(windowId: any, payload: any): any;
	updateLayers(windowId: any, canvasId: any, payload: any): any;
	updateViewport(windowId: any, payload: any): any;
	updateWindow(id: any, payload: any): any;
	updateWorkspace(config: Workspace): any;
	updateWorkspaceMosaicLayout(layout: any): any;
}

export interface Reducers {
	accessTokensReducer(): any;
	annotationsReducer(): any;
	authReducer(): any;
	catalogReducer(): any;
	companionWindowsReducer(): any;
	configReducer(): any;
	elasticLayoutReducer(): any;
	errorsReducer(): any;
	infoResponsesReducer(): any;
	layersReducer(): any;
	manifestsReducer(): any;
	searchesReducer(): any;
	viewersReducer(): any;
	windowsReducer(): any;
	workspaceReducer(): any;
}

export interface Selectors {
	getAccessTokens(state: any): any;
	getAllowedWindowViewTypes(): any;
	getAnnotationResourcesByMotivation(): any;
	getAnnotationResourcesByMotivationForCanvas(): any;
	getAnnotations(state: any): any;
	getAuth(state: any): any;
	getAuthProfiles(): any;
	getCanvas(): any;
	getCanvasDescription(): any;
	getCanvasForAnnotation(): any;
	getCanvasGrouping(): any;
	getCanvasGroupings(): any;
	getCanvasIndex(): any;
	getCanvasLabel(): any;
	getCanvasLayers(): any;
	getCanvases(): any;
	getCatalog(state: any): any;
	getCompanionAreaVisibility(): any;
	getCompanionWindow(): any;
	getCompanionWindowIdsForPosition(): any;
	getCompanionWindows(state: any): any;
	getCompanionWindowsForContent(): any;
	getCompanionWindowsForPosition(): any;
	getConfig(state: any): any;
	getContainerId(): any;
	getCurrentCanvas(): any;
	getCurrentCanvasWorld(): any;
	getDefaultSidebarVariant(): any;
	getDestructuredMetadata(iiifResource): any;
	getElasticLayout(state: any): any;
	getExpandedNodeIds(state: any, _ref2): any;
	getExportableState(state: any): any;
	getFocusedWindowId(): any;
	getFullScreenEnabled(): any;
	getLanguagesFromConfigWithCurrent(): any;
	getLatestError(state: any): any;
	getLayers(): any;
	getLayersForVisibleCanvases(): any;
	getLayersForWindow(): any;
	getManifest(state: any, _ref4): any;
	getManifestAutocompleteService(): any;
	getManifestDescription(): any;
	getManifestError(): any;
	getManifestHomepage(): any;
	getManifestLocale(): any;
	getManifestLogo(): any;
	getManifestMetadata(): any;
	getManifestProvider(): any;
	getManifestProviderName(): any;
	getManifestRelated(): any;
	getManifestRelatedContent(): any;
	getManifestRenderings(): any;
	getManifestSearchService(): any;
	getManifestSeeAlso(): any;
	getManifestStatus(): any;
	getManifestSummary(): any;
	getManifestThumbnail(state: any, props): any;
	getManifestTitle(): any;
	getManifestUrl(): any;
	getManifestoInstance(): any;
	getManifests(state: any): any;
	getManuallyExpandedNodeIds(state: any, _ref, expanded): any;
	getMaximizedWindowsIds(): any;
	getMetadataLocales(): any;
	getNextCanvasGrouping(): any;
	getNextSearchId(): any;
	getNodeIdToScrollTo(state: any, _ref3): any;
	getPresentAnnotationsOnSelectedCanvases(): any;
	getPreviousCanvasGrouping(): any;
	getProviderLogo(): any;
	getRequestsConfig(): any;
	getRequiredStatement(): any;
	getResourceAnnotationForSearchHit(): any;
	getResourceAnnotationLabel(): any;
	getRights(): any;
	getSearchAnnotationsForCompanionWindow(): any;
	getSearchAnnotationsForWindow(): any;
	getSearchForWindow(): any;
	getSearchIsFetching(): any;
	getSearchNumTotal(): any;
	getSearchQuery(): any;
	getSelectedAnnotationId(): any;
	getSelectedAnnotationsOnCanvases(): any;
	getSelectedContentSearchAnnotationIds(): any;
	getSequence(): any;
	getSequenceBehaviors(): any;
	getSequenceTreeStructure(): any;
	getSequenceViewingDirection(): any;
	getSequenceViewingHint(): any;
	getSequences(): any;
	getShowZoomControlsConfig(): any;
	getSortedLayers(): any;
	getSortedSearchAnnotationsForCompanionWindow(): any;
	getSortedSearchHitsForCompanionWindow(): any;
	getTheme(): any;
	getThemeDirection(): any;
	getThemeIds(): any;
	getThumbnailNavigationPosition(): any;
	getViewer(): any;
	getVisibleCanvasAudioResources(): any;
	getVisibleCanvasCaptions(): any;
	getVisibleCanvasIds(): any;
	getVisibleCanvasNonTiledResources(): any;
	getVisibleCanvasVideoResources(): any;
	getVisibleCanvases(): any;
	getVisibleNodeIds(): any;
	getWindow(state: any, _ref): any;
	getWindowConfig(): any;
	getWindowDraggability(): any;
	getWindowIds(): any;
	getWindowManifests(state: any): any;
	getWindowTitles(state: any): any;
	getWindowViewType(): any;
	getWindows(state: any): any;
	getWorkspace(state: any): any;
	getWorkspaceType(): any;
	isFocused(state: any, _ref3): any;
	miradorSlice(state: any): any;
	selectCompanionWindowDimensions(): any;
	selectCurrentAuthServices(): any;
	selectInfoResponse(): any;
	selectInfoResponses(state: any): any;
	sortSearchAnnotationsByCanvasOrder(searchAnnotations: any, canvases: any): any;
}
