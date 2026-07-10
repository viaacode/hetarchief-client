import type { IconProps } from '@shared/components/Icon';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export type NavigationLinkIcon = IconProps['name'] | Pick<IconProps, 'name'>;

export interface NavigationLinkProps extends DefaultComponentProps {
	children?: ReactNode;
	href?: string;
	iconStart?: NavigationLinkIcon;
	iconEnd?: NavigationLinkIcon;
	isDropdown?: boolean;
	isDropdownItem?: boolean;
	label: ReactNode;
	onClick?: () => void;
}
