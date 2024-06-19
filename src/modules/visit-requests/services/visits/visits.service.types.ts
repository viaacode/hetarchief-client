import { type OrderDirection } from '@meemoo/react-components';
import { type ReactNode } from 'react';

import { type Visit, type VisitStatus } from '@shared/types';
import { type VisitTimeframe } from '@visit-requests/types';

export interface GetVisitsProps {
	children?: ReactNode;
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
	children?: ReactNode;
	requesterId?: string;
	page?: number;
	size?: number;
	orderProp?: keyof Visit;
	orderDirection?: OrderDirection;
}
