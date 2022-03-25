import { AdvancedFilter } from '@reading-room/types';

export interface AdvancedFilterFieldsProps {
	id: string;
	index: number;
	value: AdvancedFilter;
	onChange: (index: number, values: Partial<AdvancedFilter>) => void;
	onRemove: (index: number) => void;
}
