import { OrderDirection } from '@meemoo/react-components';

import { Visit, VisitStatus } from '@shared/types';
import { VisitTimeframe } from '@visits/types';
export interface GetVisitsProps {
	searchInput?: string | undefined;
	status?: VisitStatus | undefined;
	timeframe?: VisitTimeframe | VisitTimeframe[] | undefined;
	requesterId?: string;
	visitorSpaceSlug?: string;
	page: number;
	size: number;
	orderProp?: keyof Visit;
	orderDirection?: OrderDirection;
	userProfileId?: string;
	personal?: boolean;
}

export interface GetAllActiveVisitsProps {
	requesterId: string;
	page?: number;
	size?: number;
}
