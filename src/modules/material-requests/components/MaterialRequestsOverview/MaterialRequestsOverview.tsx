import { OrderDirection } from '@meemoo/react-components';
import { FC } from 'react';

import { MaterialRequestOverviewProps } from './MaterialRequestsOverview.types';

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { MaterialRequestType } from '@material-requests/types';

const MaterialRequestOverview: FC<MaterialRequestOverviewProps> = ({ columns }) => {
	const { data } = useGetMaterialRequests({
		query: '',
		type: MaterialRequestType.MORE_INFO,
		page: 1,
		size: 10,
		orderProp: 'requesterName',
		orderDirection: OrderDirection.asc,
		isPending: false,
		maintainerIds: [],
	});

	console.log({ data });
	console.log({ columns });

	return (
		<div className="l-container">
			<div className="p-cp-material-requests__header">
				<h1>MATERIAL REQUESTS OVERVIEW</h1>
			</div>
		</div>
	);
};

export default MaterialRequestOverview;
