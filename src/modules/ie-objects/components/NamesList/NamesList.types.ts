import type { Mention } from '@ie-objects/ie-objects.types';
import type { DefaultComponentProps } from '@shared/types';

export interface NamesListProps extends DefaultComponentProps {
	mentions: Mention[];
	onZoomToLocation: (x: number, y: number) => void;
}
