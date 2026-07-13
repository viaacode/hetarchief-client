import type { VisitorSpaceCardProps } from '@shared/components/VisitorSpaceCard';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface VisitorSpaceCardListProps extends DefaultComponentProps {
	children?: ReactNode;
	items?: VisitorSpaceCardProps[];
	limit?: boolean;
}
