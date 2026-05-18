import {
	IiifViewerAction,
	type IiifViewerEvent,
	type IiifViewerZoomToRectEvent,
	type TextLine,
} from '@iiif-viewer/IiifViewer.types';

/**
 * Helper functions to trigger events that will be caught by the IIIF viewer.
 * We implemented this as html event instead of forward ref
 * Since implementing this with forwardRef causes a lot of renders and kills performance
 * https://meemoo.atlassian.net/browse/ARC-2974
 * https://meemoo.atlassian.net/browse/ARC-2986
 */

export async function iiifZoomToRect(iiifViewerInitialized: Promise<void>, textLine: TextLine) {
	await iiifViewerInitialized;
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_ZOOM_TO_RECT);
	(event as IiifViewerZoomToRectEvent).functionProps = textLine;
	window.dispatchEvent(event);
}

export async function iiifZoomTo(iiifViewerInitialized: Promise<void>, x: number, y: number) {
	await iiifViewerInitialized;
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_ZOOM_TO);
	(event as IiifViewerEvent).functionProps = { x, y };
	window.dispatchEvent(event);
}

export async function iiifGoToHome(iiifViewerInitialized: Promise<void>) {
	await iiifViewerInitialized;
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_GO_TO_HOME);
	window.dispatchEvent(event);
}

export async function iiifGoToPage(iiifViewerInitialized: Promise<void>, pageIndex: number) {
	await iiifViewerInitialized;
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_GO_TO_PAGE);
	(event as IiifViewerEvent).functionProps = { pageIndex };
	window.dispatchEvent(event);
}

export async function iiifUpdateHighlightedAltoTexts(
	iiifViewerInitialized: Promise<void>,
	highlightedAltoTexts: TextLine[],
	selectedAltoText: TextLine | null,
	zoomToSelectedAltoText: boolean
) {
	await iiifViewerInitialized;
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_UPDATE_HIGHLIGHTED_ALTO_TEXTS);
	(event as IiifViewerEvent).functionProps = {
		highlightedAltoTexts,
		selectedAltoText,
		zoomToSelectedAltoText,
	};
	window.dispatchEvent(event);
}
