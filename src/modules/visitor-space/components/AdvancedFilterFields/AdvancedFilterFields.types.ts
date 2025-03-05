import type { ReactNode } from 'react';

import type { FilterValue } from '../../types';

export interface AdvancedFilterFieldsProps {
	children?: ReactNode;
	id: string;
	index: number;
	value: FilterValue;
	onChange: (index: number, value: FilterValue) => void;
	onRemove: (index: number) => void;
}
