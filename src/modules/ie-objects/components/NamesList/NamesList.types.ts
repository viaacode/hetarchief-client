import type { DefaultComponentProps } from '@shared/types';

export interface Mention {
	iri: string;
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	confidence: number;
	birthDate: number;
	birthPlace: string;
	deathDate: number;
	deathPlace: string;
}

export interface NamesListProps extends DefaultComponentProps {
	mentions: Mention[];
	onZoomToLocation: (x: number, y: number) => void;
}
