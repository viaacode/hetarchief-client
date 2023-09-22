import { DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceDropdownProps extends DefaultComponentProps {
	children?: React.ReactNode;
	options: VisitorSpaceDropdownOption[];
	selectedOptionId: string | null;
	onSelected: (visitorSpaceId: string) => void;
}

export interface VisitorSpaceDropdownOption {
	slug: string;
	label: string;
	extraInfo?: string;
}
