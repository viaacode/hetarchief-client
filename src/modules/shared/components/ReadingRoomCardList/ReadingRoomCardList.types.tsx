import { DefaultComponentProps } from '@shared/types';

import { VisitorSpaceCardProps } from '../ReadingRoomCard/ReadingRoomCard.types';

export interface ReadingRoomCardListProps extends DefaultComponentProps {
	items?: VisitorSpaceCardProps[];
	limit?: boolean;
}
