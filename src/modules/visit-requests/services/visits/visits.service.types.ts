import { OrderDirection } from '@meemoo/react-components';

import { Visit, VisitStatus } from '@shared/types';
import { VisitTimeframe } from '@visit-requests/types';

export interface GetVisitsProps {
	children?: React.ReactNode;
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
	children?: React.ReactNode;
	requesterId?: string;
	page?: number;
	size?: number;
	orderProp?: keyof Visit;
	orderDirection?: OrderDirection;
}
