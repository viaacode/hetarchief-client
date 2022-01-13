import { DefaultComponentProps } from '@shared/types';

import { ReadingRoomCardProps } from '../ReadingRoomCard/ReadingRoomCard.types';

export interface ReadingRoomCardListProps extends DefaultComponentProps {
	items?: ReadingRoomCardProps[];
	limit?: boolean;
}
