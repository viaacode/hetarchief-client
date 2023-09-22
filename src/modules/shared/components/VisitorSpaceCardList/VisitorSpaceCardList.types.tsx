import { DefaultComponentProps } from '@shared/types';

import { VisitorSpaceCardProps } from '../VisitorSpaceCard/VisitorSpaceCard.types';

export interface VisitorSpaceCardListProps extends DefaultComponentProps {
	children?: React.ReactNode;
	items?: VisitorSpaceCardProps[];
	limit?: boolean;
}
