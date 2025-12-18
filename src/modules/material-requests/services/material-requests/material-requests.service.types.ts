import type {
	MaterialRequest,
	MaterialRequestStatus,
	MaterialRequestType,
} from '@material-requests/types';
import type { OrderDirection } from '@meemoo/react-components';
import type { ReactNode } from 'react';

export interface GetMaterialRequestsProps {
	children?: ReactNode;
	search?: string;
	type?: MaterialRequestType[];
	status?: MaterialRequestStatus[];
	maintainerIds?: string[];
	isPending?: boolean;
	page?: number;
	size?: number;
	orderProp?: keyof MaterialRequest;
	orderDirection?: OrderDirection;
	isPersonal?: boolean;
}
