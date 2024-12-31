import { type OrderDirection } from '@meemoo/react-components';
import { type ReactNode } from 'react';

import { type VisitRequest, type VisitStatus } from '@shared/types/visit-request';
import { type VisitTimeframe } from '@visit-requests/types';

export interface GetVisitRequestsProps {
	children?: ReactNode;
	searchInput?: string | undefined;
	status?: VisitStatus | undefined;
	timeframe?: VisitTimeframe | VisitTimeframe[] | undefined;
	requesterId?: string;
	visitorSpaceSlug?: string;
	page: number;
	size: number;
	orderProp?: keyof VisitRequest;
	orderDirection?: OrderDirection;
	userProfileId?: string;
	personal?: boolean;
	ignoreAuthError?: boolean;
}

export interface GetAllActiveVisitsProps {
	children?: ReactNode;
	requesterId?: string;
	page?: number;
	size?: number;
	orderProp?: keyof VisitRequest;
	orderDirection?: OrderDirection;
}
