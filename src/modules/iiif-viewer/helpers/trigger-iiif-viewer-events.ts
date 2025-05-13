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
 * @param textLine
 */

export function iiifZoomToRect(textLine: TextLine) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_ZOOM_TO_RECT);
	(event as IiifViewerZoomToRectEvent).functionProps = textLine;
	window.dispatchEvent(event);
}

export function iiifRotate(rotateRight: boolean) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_ROTATE);
	(event as IiifViewerEvent).functionProps = { rotateRight };
	window.dispatchEvent(event);
}

export function iiifFullscreen(expand: boolean) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_FULLSCREEN);
	(event as IiifViewerEvent).functionProps = { expand };
	window.dispatchEvent(event);
}

export function iiifZoom(multiplier: number) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_ZOOM);
	(event as IiifViewerEvent).functionProps = { multiplier };
	window.dispatchEvent(event);
}

export function iiifZoomTo(x: number, y: number) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_ZOOM_TO);
	(event as IiifViewerEvent).functionProps = { x, y };
	window.dispatchEvent(event);
}

export function iiifGoToHome() {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_GO_TO_HOME);
	window.dispatchEvent(event);
}

export function iiifGoToPage(pageIndex: number) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_GO_TO_PAGE);
	(event as IiifViewerEvent).functionProps = { pageIndex };
	window.dispatchEvent(event);
}

export function iiifWaitForReadyState() {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_WAIT_FOR_READY_STATE);
	window.dispatchEvent(event);
}

export function iiifUpdateHighlightedAltoTexts(
	highlightedAltoTexts: TextLine[],
	selectedAltoText: TextLine | null
) {
	const event: Event = new Event(IiifViewerAction.IIIF_VIEWER_UPDATE_HIGHLIGHTED_ALTO_TEXTS);
	(event as IiifViewerEvent).functionProps = {
		highlightedAltoTexts,
		selectedAltoText,
	};
	window.dispatchEvent(event);
}
