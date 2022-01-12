import { ReadingRoomCardProps } from '../ReadingRoomCard/ReadingRoomCard.types';

import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomCardListProps extends DefaultComponentProps {
	items?: ReadingRoomCardProps[];
	limit?: boolean;
}
