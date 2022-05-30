import { DefaultComponentProps } from '@shared/types';

import { VisitorSpaceCardProps } from '../VisitorSpaceCard/VisitorSpaceCard.types';

export interface VisitorSpaceCardListProps extends DefaultComponentProps {
	items?: VisitorSpaceCardProps[];
	limit?: boolean;
}
