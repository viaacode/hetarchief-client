import { type ReactNode } from 'react';

import { type DefaultComponentProps } from '@shared/types';

export interface VisitorSpaceDropdownProps extends DefaultComponentProps {
	children?: ReactNode;
	options: VisitorSpaceDropdownOption[];
	selectedOptionId: string | null;
	onSelected: (visitorSpaceId: string) => void;
}

export interface VisitorSpaceDropdownOption {
	slug: string;
	label: string;
	extraInfo?: string;
}
