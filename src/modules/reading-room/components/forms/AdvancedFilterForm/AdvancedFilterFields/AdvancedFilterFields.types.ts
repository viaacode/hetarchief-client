import { AdvancedFilterFieldsState } from '../AdvancedFilterForm.types';

export interface AdvancedFilterFieldsProps {
	id: string;
	index: number;
	value: AdvancedFilterFieldsState;
	onChange: (index: number, values: Partial<AdvancedFilterFieldsState>) => void;
	onRemove: (index: number) => void;
}

export enum MetadataProp {
	Title = 'title',
	SecundaryTitle = 'secundary_title',
}

export enum Operator {
	Contains = 'contains',
	ContainsNot = 'contains-not',
	Equals = 'equals',
	EqualsNot = 'equals-not',
}
