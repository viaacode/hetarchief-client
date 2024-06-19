import { type ReactNode } from 'react';

export interface NextLinkWrapperProps {
	href: string;
	className?: string;
	children: ReactNode | string;
}
