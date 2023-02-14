import { OrderDirection, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash';
import { FC, ReactNode, useMemo } from 'react';
import { SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import {
	CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
} from '@cp/const/material-requests.const';
import { Loading, PaginationBar, SearchBar, sortingIcons } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';

import { MaterialRequestOverviewProps } from './MaterialRequestsOverview.types';

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import {
	MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestType,
} from '@material-requests/types';

const MaterialRequestOverview: FC<MaterialRequestOverviewProps> = ({ columns }) => {
	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		size: MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters.search) && { search: filters.search }),
		...(!isNil(filters.page) && { page: filters.page }),
		...(!isNil(filters.type) && { type: filters.type as MaterialRequestType }),
		...(!isNil(filters.orderProp) && { orderProp: filters.orderProp as MaterialRequestKeys }),
		...(!isNil(filters.orderDirection) && {
			orderDirection: filters.orderDirection as OrderDirection,
		}),
	});

	const noData = useMemo((): boolean => isEmpty(materialRequests?.items), [materialRequests]);

	const sortFilters = useMemo(
		(): SortingRule<{ id: MaterialRequestKeys; desc: boolean }>[] => [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== OrderDirection.asc,
			},
		],
		[filters]
	);

	const onSearch = (value: string | undefined): void => {
		setFilters({
			[SEARCH_QUERY_KEY]: value,
			page: 1,
		});
	};

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	): void => {
		if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp,
				orderDirection,
				page: 1,
			});
		}
	};

	const onPageChange = (pageZeroBased: number, gotoPage: (i: number) => void): void => {
		gotoPage(pageZeroBased);
		setFilters({
			...filters,
			page: pageZeroBased + 1,
		});
	};

	const renderPagination = ({ gotoPage }: { gotoPage: (i: number) => void }): ReactNode => (
		<PaginationBar
			className="u-mt-16 u-mb-16"
			start={Math.max(0, filters.page - 1) * MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/beheer/materiaalaanvragen/index___geen-materiaal-aanvragen');

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
							sortBy: sortFilters,
						} as TableState<MaterialRequest>,
					}}
					sortingIcons={sortingIcons}
					pagination={renderPagination}
					onSortChange={onSortChange}
				/>
			</div>
		);
	};

	return (
		<>
			<div className="l-container">
				<div className="p-cp-material-requests__header">
					<div className="p-cp-material-requests__dropdown">
						<p>TODO: DROPDOWN</p>
					</div>
					<SearchBar
						id="materiaalaanvragen-searchbar"
						default={filters[SEARCH_QUERY_KEY]}
						className="p-cp-material-requests__searchbar"
						placeholder={tText('pages/beheer/materiaalaanvragen/index___zoek')}
						onSearch={onSearch}
					/>
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
