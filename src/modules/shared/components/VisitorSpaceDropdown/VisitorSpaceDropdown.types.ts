import { DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceDropdownProps extends DefaultComponentProps {
	options: VisitorSpaceDropdownOption[];
	selectedOptionId: string;
	onSelected: (visitorSpaceId: string) => void;
}

export interface VisitorSpaceDropdownOption {
	id: string;
	label: string;
	extraInfo?: string;
}
