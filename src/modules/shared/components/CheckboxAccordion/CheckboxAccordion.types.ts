import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface CheckboxAccordionOption<ValueType> {
	label: string;
	value: ValueType;
	description: string | ReactNode;
	placeholder?: string;
	maxLength?: number;
}

export interface CheckboxAccordionItem<ValueType> {
	type: ValueType;
	text: string;
}

export interface CheckboxAccordionProps<ValueType> extends DefaultComponentProps {
	title?: string;
	options: CheckboxAccordionOption<ValueType>[];
	selectedOptions: CheckboxAccordionItem<ValueType>[];
	onChange: (selectedOptions: CheckboxAccordionItem<ValueType>[]) => void;
	error?: string | null;
	showValidation?: boolean;
}
