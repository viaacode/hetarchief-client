import { type OrderDirection } from '@meemoo/react-components';
import { type ReactNode } from 'react';

import { type MaterialRequest, type MaterialRequestType } from '@material-requests/types';

export interface GetMaterialRequestsProps {
	children?: ReactNode;
	search?: string;
	type?: MaterialRequestType[];
	maintainerIds?: string[];
	isPending?: boolean;
	page?: number;
	size?: number;
	orderProp?: keyof MaterialRequest;
	orderDirection?: OrderDirection;
	isPersonal?: boolean;
}
