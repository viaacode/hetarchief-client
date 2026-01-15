import type { VisitRequest, VisitStatus } from '@shared/types/visit-request';
import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { VisitTimeframe } from '@visit-requests/types';
import type { ReactNode } from 'react';

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
	orderDirection?: AvoSearchOrderDirection;
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
	orderDirection?: AvoSearchOrderDirection;
}
