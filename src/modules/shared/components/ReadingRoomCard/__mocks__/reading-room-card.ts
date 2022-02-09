import { ReadingRoomCardType } from '../ReadingRoomCard.const';
import { ReadingRoomAccess, ReadingRoomCardProps } from '../ReadingRoomCard.types';

export const mockReadingRoomCardProps: ReadingRoomCardProps = {
	room: {
		id: 78912,
		color: '#220538',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'Studio Hyperdrive',
		description:
			'A digital development studio that shoots for the stars. We are a bunch of JavaScript enthusiasts who thrive on getting things done. We are using a solid set of technologies and methodologies we truly believe in as a spearpoint to help you realize your full digital potential.',
	},
	type: ReadingRoomCardType.noAccess,
};

export const NoAccess: ReadingRoomAccess = {
	granted: false,
	pending: false,
};

export const AccessRequested: ReadingRoomAccess = {
	granted: false,
	pending: true,
};

export const AccessGranted: ReadingRoomAccess = {
	granted: true,
	pending: false,
	from: new Date(),
	until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
};
