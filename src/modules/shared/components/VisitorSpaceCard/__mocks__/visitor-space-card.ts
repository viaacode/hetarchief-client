import { VisitorSpaceCardType } from '../VisitorSpaceCard.const';
import { VisitorSpaceAccess, VisitorSpaceCardProps } from '../VisitorSpaceCard.types';

export const mockVisitorSpaceCardProps: VisitorSpaceCardProps = {
	room: {
		id: '78912',
		slug: 'amsab',
		color: '#220538',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'Studio Hyperdrive',
		info: 'A digital development studio that shoots for the stars. We are a bunch of JavaScript enthusiasts who thrive on getting things done. We are using a solid set of technologies and methodologies we truly believe in as a spearpoint to help you realize your full digital potential.',
	},
	type: VisitorSpaceCardType.noAccess,
};

export const NoAccess: VisitorSpaceAccess = {
	granted: false,
	pending: false,
};

export const AccessRequested: VisitorSpaceAccess = {
	granted: false,
	pending: true,
};

export const AccessGranted: VisitorSpaceAccess = {
	granted: true,
	pending: false,
	from: new Date(),
	until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
};
