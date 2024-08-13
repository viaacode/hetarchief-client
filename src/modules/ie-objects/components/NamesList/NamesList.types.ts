import { type DefaultComponentProps } from '@shared/types';

export interface NameInfo {
	name: string;
	bornYear: string;
	diedYear: string;
	bornLocation: string;
	diedLocation: string;
	ocrLocationX: number;
	ocrLocationY: number;
	ocrConfidence: number;
	link?: string;
}

export interface NamesListProps extends DefaultComponentProps {
	names: NameInfo[];
	onZoomToLocation: (x: number, y: number) => void;
}
