import { noop } from 'lodash-es';
import type { MouseTracker, Point, PointerMouseTrackerEvent, Viewer } from 'openseadragon';

import type { ImageSize, Rect } from '@iiif-viewer/IiifViewer.types';
import { getRectFromPointerEventDrag } from '@iiif-viewer/helpers/rect-from-pointer-event-drag';

// We need to track some state on the window object because the open sea dragon viewer isn't being reloaded by react
// so we cannot access the actual react state
const setSelectionStartPoint = (newSelectionStartPoint: Point | null) => {
	// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
	(window as any).selectionStartPoint = newSelectionStartPoint;
	return newSelectionStartPoint;
};

const setSelectionOverlayElement = (newSelectionOverlayElement: HTMLDivElement | null) => {
	// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
	(window as any).selectionOverlayElement = newSelectionOverlayElement;
	return newSelectionOverlayElement;
};

const setMouseTracker = (newMouseTracker: MouseTracker | null) => {
	// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
	(window as any).mouseTracker = newMouseTracker;
	return newMouseTracker;
};

export function initOpenSeadragonViewerMouseTracker(
	imageSize: ImageSize,
	onSelection: (rect: Rect) => void,
	// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
	openSeaDragonLib: any,
	openSeaDragonViewer: Viewer
) {
	if (!openSeaDragonLib?.MouseTracker || !openSeaDragonViewer?.element) {
		return;
	}
	// Code taken from https://codepen.io/iangilman/pen/qBdabGM?editors=0010
	setMouseTracker(
		new openSeaDragonLib.MouseTracker({
			element: openSeaDragonViewer.element,
			pressHandler: (event: PointerMouseTrackerEvent) =>
				handlePress(event, openSeaDragonLib, openSeaDragonViewer),
			dragHandler: (event: PointerMouseTrackerEvent) =>
				handleDrag(event, openSeaDragonLib, openSeaDragonViewer),
			releaseHandler: (event: PointerMouseTrackerEvent) =>
				handleRelease(event, imageSize, onSelection, openSeaDragonLib, openSeaDragonViewer),
		})
	);
}

export function destroyOpenSeadragonViewerMouseTracker() {
	setMouseTracker(null);
}

export function handlePress(
	event: PointerMouseTrackerEvent,
	// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
	openSeaDragonLib: any,
	openSeaDragonViewer: Viewer
) {
	if (!openSeaDragonViewer || !openSeaDragonLib) {
		return;
	}

	// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
	if (!(window as any).isSelectionActive) {
		resetDragState(openSeaDragonViewer);
		return;
	}

	const getSelectionOverlayElement = document.createElement('div');
	getSelectionOverlayElement.style.border = '4px dotted #00c8aa';
	getSelectionOverlayElement.style.background = '#00c8aa22';
	const selectionStartPointTemp = openSeaDragonViewer.viewport.pointFromPixel(
		(event as PointerMouseTrackerEvent).position
	);
	openSeaDragonViewer.addOverlay(
		getSelectionOverlayElement,
		new openSeaDragonLib.Rect(selectionStartPointTemp.x, selectionStartPointTemp.y, 0, 0)
	);

	setSelectionStartPoint(selectionStartPointTemp);
	setSelectionOverlayElement(getSelectionOverlayElement);
}

export function handleDrag(
	event: PointerMouseTrackerEvent,
	// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
	openSeaDragonLib: any,
	openSeaDragonViewer: Viewer
) {
	if (!openSeaDragonViewer || !openSeaDragonLib) {
		resetDragState(openSeaDragonViewer);
		return;
	}

	if (
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		!(window as any).isSelectionActive ||
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		!((window as any).selectionStartPoint as Point | null) ||
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		!((window as any).selectionOverlayElement as HTMLDivElement | null)
	) {
		return;
	}

	const rect = getRectFromPointerEventDrag(
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		(window as any).selectionStartPoint as Point,
		(event as PointerMouseTrackerEvent).position,
		openSeaDragonViewer,
		openSeaDragonLib.Rect
	);

	openSeaDragonViewer.updateOverlay(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(window as any).selectionOverlayElement as HTMLDivElement,
		rect
	);
}

export function handleRelease(
	event: PointerMouseTrackerEvent,
	imageSize: ImageSize,
	onSelection: (rect: Rect) => void,
	// biome-ignore lint/suspicious/noExplicitAny: open sea dragon lib isn't typed yet
	openSeaDragonLib: any,
	openSeaDragonViewer: Viewer
) {
	if (!openSeaDragonViewer || !openSeaDragonLib) {
		return;
	}
	if (
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		!(window as any).isSelectionActive ||
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		!((window as any).selectionStartPoint as Point | null) ||
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		!((window as any).selectionOverlayElement as HTMLDivElement | null)
	) {
		resetDragState(openSeaDragonViewer);
		return;
	}
	const rect = getRectFromPointerEventDrag(
		// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
		(window as any).selectionStartPoint as Point,
		(event as PointerMouseTrackerEvent).position,
		openSeaDragonViewer,
		openSeaDragonLib.Rect
	);

	const imageRect = {
		x: rect.x * imageSize.width,
		y: rect.y * imageSize.width, // No idea why this requires the width and not the height, but if we change this it exports the wrong section of the image
		width: rect.width * imageSize.width,
		height: rect.height * imageSize.width, // No idea why this requires the width and not the height, but if we change this it exports the wrong section of the image
	};
	(onSelection || noop)(imageRect);

	resetDragState(openSeaDragonViewer);
}

export function resetDragState(openSeaDragonViewer: Viewer | null) {
	// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
	if ((window as any).selectionOverlayElement as HTMLDivElement | null) {
		openSeaDragonViewer?.removeOverlay(
			// biome-ignore lint/suspicious/noExplicitAny: window isn't typed yet
			(window as any).selectionOverlayElement as HTMLDivElement
		);
	}
	setSelectionStartPoint(null);
	setSelectionOverlayElement(null);
	destroyOpenSeadragonViewerMouseTracker();
	openSeaDragonViewer?.setMouseNavEnabled(true);
}
