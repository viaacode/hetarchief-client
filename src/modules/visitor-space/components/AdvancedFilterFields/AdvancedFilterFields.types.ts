import { type ReactNode } from 'react';

import { type AdvancedFilter } from '../../types';

export interface AdvancedFilterFieldsProps {
	children?: ReactNode;
	id: string;
	index: number;
	value: AdvancedFilter;
	onChange: (index: number, values: Partial<AdvancedFilter>) => void;
	onRemove: (index: number) => void;
}
