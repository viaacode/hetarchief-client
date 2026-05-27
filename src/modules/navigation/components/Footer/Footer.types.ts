import type { ComponentLink } from '@shared/types';
import type { ReactNode } from 'react';

export interface FooterProps {
	children?: ReactNode;
	linkSections: ComponentLink[][];
}
