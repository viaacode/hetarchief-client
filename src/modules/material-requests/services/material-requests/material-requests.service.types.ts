import type {
	MaterialRequest,
	MaterialRequestStatus,
	MaterialRequestType,
} from '@material-requests/types';
import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { ReactNode } from 'react';

export interface GetMaterialRequestsProps {
	children?: ReactNode;
	search?: string;
	type?: MaterialRequestType[];
	status?: MaterialRequestStatus[];
	hasDownloadUrl?: string[];
	maintainerIds?: string[];
	isPending?: boolean;
	page?: number;
	size?: number;
	orderProp?: keyof MaterialRequest;
	orderDirection?: AvoSearchOrderDirection;
	isPersonal?: boolean;
}
