import { ReactNode } from 'react';

import { IconProps } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export type NavigationLinkIcon = IconProps['name'] | Pick<IconProps, 'name'>;

export interface NavigationLinkProps extends DefaultComponentProps {
	children?: React.ReactNode;
	href?: string;
	iconStart?: NavigationLinkIcon;
	iconEnd?: NavigationLinkIcon;
	isDropdown?: boolean;
	isDropdownItem?: boolean;
	label: ReactNode;
	onClick?: () => void;
}
