import { AdvancedFilter } from '../../types';

export interface AdvancedFilterFieldsProps {
	children?: React.ReactNode;
	id: string;
	index: number;
	value: AdvancedFilter;
	onChange: (index: number, values: Partial<AdvancedFilter>) => void;
	onRemove: (index: number) => void;
}
