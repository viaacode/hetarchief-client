import { OrderDirection } from '@meemoo/react-components';

import { MaterialRequest, MaterialRequestType } from '@modules/material-requests/types';

export interface GetMaterialRequestsProps {
	children?: React.ReactNode;
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
