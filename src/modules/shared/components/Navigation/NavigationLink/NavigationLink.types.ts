import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface NavigationLinkProps extends DefaultComponentProps {
	href?: string;
	iconStart?: ReactNode;
	iconEnd?: ReactNode;
	isDropdown?: boolean;
	isDropdownItem?: boolean;
	label: ReactNode;
	onClick?: () => void;
}
