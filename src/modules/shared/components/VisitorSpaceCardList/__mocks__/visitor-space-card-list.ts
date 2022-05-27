import { VisitorSpaceCardType } from '@shared/components';
import {
	AccessGranted,
	AccessRequested,
	mockVisitorSpaceCardProps,
} from '@shared/components/VisitorSpaceCard/__mocks__/visitor-space-card';

export const sixItems = [1, 2, 3, 6, 4, 5].map((data: number) => {
	const hasAccess = data % 2 !== 1;

	return {
		...mockVisitorSpaceCardProps,
		access: hasAccess ? AccessGranted : AccessRequested,
		type: VisitorSpaceCardType.noAccess,
	};
});
