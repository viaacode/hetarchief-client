import { type AltoTextLine } from '@ie-objects/ie-objects.types';

export function getAltoTextId(textLocation: AltoTextLine): string {
	return [textLocation.x, textLocation.y, textLocation.width, textLocation.height].join('-');
}
