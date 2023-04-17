import { ReactElement } from 'react';

export interface NextLinkWrapperProps {
	href: string;
	className?: string;
	children: ReactElement | string;
}
