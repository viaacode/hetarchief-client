import { ReactNode } from 'react';

import { IconProps } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export type NavigationLinkIcon = IconProps['name'] | Pick<IconProps, 'name' | 'type'>;

export interface NavigationLinkProps extends DefaultComponentProps {
	href?: string;
	iconStart?: NavigationLinkIcon;
	iconEnd?: NavigationLinkIcon;
	isDropdown?: boolean;
	isDropdownItem?: boolean;
	label: ReactNode;
	onClick?: () => void;
}
