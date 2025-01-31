import type { Point, Rect, Viewer } from 'openseadragon';

export function getRectFromPointerEventDrag(
	startPoint: Point,
	mousePosition: Point,
	viewer: Viewer,
	rectClass: any
): Rect {
	const viewportPos = viewer.viewport.pointFromPixel(mousePosition);
	const diffX = viewportPos.x - startPoint.x;
	const diffY = viewportPos.y - startPoint.y;

	return new rectClass(
		Math.min(startPoint.x, startPoint.x + diffX),
		Math.min(startPoint.y, startPoint.y + diffY),
		Math.abs(diffX),
		Math.abs(diffY)
	);
}
