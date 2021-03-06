import { OrderDirection, Visit, VisitStatus } from '@shared/types';
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
