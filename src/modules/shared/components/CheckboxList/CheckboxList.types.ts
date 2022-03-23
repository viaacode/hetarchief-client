import { DefaultComponentProps } from '@shared/types';

export interface CheckboxListProps<T> extends DefaultComponentProps {
	items: Array<T & { label: string; value: unknown; checked?: boolean }>;
	onItemClick: (checked: boolean, value: unknown) => void;
}
