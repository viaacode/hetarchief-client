import { AdvancedFilterFieldsState } from '../AdvancedFilterForm/AdvancedFilterForm.types';

export interface AdvancedFilterFieldsProps {
	id: string;
	index: number;
	value: AdvancedFilterFieldsState;
	onChange: (index: number, values: Partial<AdvancedFilterFieldsState>) => void;
	onRemove: (index: number) => void;
}
