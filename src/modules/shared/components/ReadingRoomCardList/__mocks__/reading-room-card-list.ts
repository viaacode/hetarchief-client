import { ReadingRoomCardType } from '@shared/components';
import {
	AccessGranted,
	AccessRequested,
	mockReadingRoomCardProps,
} from '@shared/components/ReadingRoomCard/__mocks__/reading-room-card';

export const sixItems = [1, 2, 3, 6, 4, 5].map((data: number) => {
	const hasAccess = data % 2 !== 1;

	return {
		...mockReadingRoomCardProps,
		access: hasAccess ? AccessGranted : AccessRequested,
		type: ReadingRoomCardType.noAccess,
	};
});
