import { AdvancedFilterFieldsState } from '../AdvancedFilterForm.types';

export interface AdvancedFilterFieldsProps {
	id: string;
	index: number;
	value: AdvancedFilterFieldsState;
	onChange: (index: number, values: Partial<AdvancedFilterFieldsState>) => void;
	onRemove: (index: number) => void;
}

export enum MetadataProp {
	CreatedAt = 'creatiedatum',
	Creator = 'maker',
	Description = 'beschrijving',
	Duration = 'duurtijd',
	Era = 'tijdsperiode',
	Everything = 'alles',
	Genre = 'genre',
	Language = 'taal',
	Location = 'locatie',
	Mediatype = 'bestandstype',
	Medium = 'drager',
	PublishedAt = 'uitzenddatum',
	Publisher = 'publisher',
	Title = 'titel',
}

export enum Operator {
	Contains = 'contains',
	ContainsNot = 'contains-not',
	Equals = 'equals',
	EqualsNot = 'equals-not',
}
