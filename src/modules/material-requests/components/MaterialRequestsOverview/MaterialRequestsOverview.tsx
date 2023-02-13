import { OrderDirection, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { FC, ReactNode, useMemo } from 'react';
import { TableState } from 'react-table';

import { MATERIAL_REQUESTS_TABLE_PAGE_SIZE } from '@cp/const/material-requests.const';
import { Loading, PaginationBar, sortingIcons } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { MaterialRequestOverviewProps } from './MaterialRequestsOverview.types';

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { GetMaterialRequestsProps } from '@material-requests/services';
import { MaterialRequest, MaterialRequestType } from '@material-requests/types';

const materialRequestProps: GetMaterialRequestsProps = {
	query: '',
	type: MaterialRequestType.MORE_INFO,
	page: 1,
	size: 10,
	orderProp: 'requesterFullName',
	orderDirection: OrderDirection.asc,
	isPending: false,
	maintainerIds: [],
};

const MaterialRequestOverview: FC<MaterialRequestOverviewProps> = ({ columns }) => {
	const { tHtml } = useTranslation();
	const { data: materialRequests, isFetching } = useGetMaterialRequests(materialRequestProps);

	const noData = useMemo(() => isEmpty(materialRequests?.items), [materialRequests]);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/beheer/materiaal-aanvragen/index___geen-materiaal-aanvragen');

	const renderPagination = (): ReactNode => {
		return (
			<PaginationBar
				className="u-mt-16 u-mb-16"
				count={MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
				start={1}
				total={materialRequests?.total || 0}
				onPageChange={() => console.log('pagination change')}
			/>
		);
	};

	const renderContent = (): ReactNode => {
		return (
			<div className="l-container l-container--edgeless-to-lg">
				<Table<MaterialRequest>
					className="u-mt-24 p-cp-material-requests__table"
					options={{
						columns,
						data: materialRequests?.items || [],
						initialState: {
							pageSize: MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
							// sortBy: {
							// 	id: 'requesterFullName',
							// 	desc: OrderDirection.asc,
							// },
						} as TableState<MaterialRequest>,
					}}
					pagination={renderPagination}
					sortingIcons={sortingIcons}
					onRowClick={() => console.log('onRowClick')}
					onSortChange={() => console.log('onSortChange')}
				/>
			</div>
		);
	};

	return (
		<>
			<div className="l-container">
				<div className="p-cp-material-requests__header">
					<p>TODO: DROPDOWN FILTER</p>
					<p>TODO: SEARCHBAR</p>
				</div>
			</div>

			<div
				className={clsx('l-container l-container--edgeless-to-lg', {
					'u-text-center u-color-neutral u-py-48': isFetching || noData,
				})}
			>
				{isFetching && <Loading owner="Material requests overview" />}
				{noData && renderEmptyMessage()}
				{!noData && !isFetching && renderContent()}
			</div>
		</>
	);
};

export default MaterialRequestOverview;
