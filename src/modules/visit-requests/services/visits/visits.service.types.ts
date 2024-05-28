import { OrderDirection } from '@meemoo/react-components';

import { VisitTimeframe } from '@modules/visit-requests/types';
import { Visit, VisitStatus } from '@shared/types';

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
