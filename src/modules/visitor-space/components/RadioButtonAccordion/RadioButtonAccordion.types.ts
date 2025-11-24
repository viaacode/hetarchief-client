import type { ReactNode } from 'react';

export interface RadioButtonAccordionOption<ValueType> {
	label: string;
	value: ValueType;
	description: string | ReactNode;
}
