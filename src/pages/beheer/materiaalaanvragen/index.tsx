import { MultiSelect, MultiSelectOption, OrderDirection, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil, without } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import MaterialRequestDetailBlade from '@account/components/MaterialRequestDetailBlade/MaterialRequestDetailBlade';
import { Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	GET_CP_MATERIAL_REQUEST_TYPE_FILTER_ARRAY,
	getMaterialRequestTableColumns,
} from '@cp/const/material-requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import {
	MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestType,
} from '@material-requests/types';
import {
	Icon,
	IconNamesLight,
	Loading,
	PaginationBar,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const CPMaterialRequestsPage: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);

	const user = useSelector(selectUser);

	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();
	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		size: CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters.search) && { search: filters.search }),
		...(!isNil(filters.page) && { page: filters.page }),
		...(!isNil(filters.type) && { type: filters.type as MaterialRequestType[] }),
		...(!isNil(filters.orderProp) && { orderProp: filters.orderProp as MaterialRequestKeys }),
		...(!isNil(filters.orderDirection) && {
			orderDirection: filters.orderDirection as OrderDirection,
		}),
		(...(user?.maintainerId ? { maintainerIds: [user.maintainerId] } : {}),
	});

	const { data: currentMaterialRequestDetail, isFetching: isLoading } = useGetMaterialRequestById(
		currentMaterialRequest?.id || null
	);

	const noData = useMemo((): boolean => isEmpty(materialRequests?.items), [materialRequests]);

	const typesList = useMemo(() => {
		return [
			...GET_CP_MATERIAL_REQUEST_TYPE_FILTER_ARRAY().map(
				({ id, label }): MultiSelectOption => ({
					id,
					label,
					checked: selectedTypes.includes(id),
				})
			),
		];
	}, [selectedTypes]);

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

	const onMultiTypeChange = (checked: boolean, id: string) => {
		setSelectedTypes((prev) => (!checked ? [...prev, id] : without(prev, id)));
	};

	useEffect(() => {
		setFilters({
			...filters,
			type: selectedTypes,
			page: 1,
		});
	}, [selectedTypes]);

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	): void => {
		if (filters.orderProp === MaterialRequestKeys.createdAt && orderDirection === undefined) {
			setFilters({
				...filters,
				orderProp,
				orderDirection: OrderDirection.asc,
				page: 1,
			});
		} else if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
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
			start={Math.max(0, filters.page - 1) * CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/beheer/materiaalaanvragen/index___geen-materiaal-aanvragen');

	const renderDetailBlade = () => {
		return (
			<MaterialRequestDetailBlade
				isOpen={!isLoading && isDetailBladeOpen}
				onClose={() => setIsDetailBladeOpen(false)}
				currentMaterialRequestDetail={currentMaterialRequestDetail}
			/>
		);
	};

	const onRowClick = (evt: MouseEvent<HTMLTableRowElement>, row: Row<MaterialRequest>) => {
		setCurrentMaterialRequest(row.original);
		setIsDetailBladeOpen(true);
	};

	const renderContent = (): ReactNode => {
		return (
			<Table<MaterialRequest>
				className="u-mt-24 p-material-requests__table"
				options={{
					columns: getMaterialRequestTableColumns(),
					data: materialRequests?.items || [],
					initialState: {
						pageSize: CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
						sortBy: sortFilters,
					} as TableState<MaterialRequest>,
				}}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				onSortChange={onSortChange}
				onRowClick={onRowClick}
			/>
		);
	};

	const renderPageContent = () => {
		return (
			<CPAdminLayout
				className="p-material-requests"
				pageTitle={tText('pages/beheer/materiaalaanvragen/index___materiaalaanvragen')}
			>
				<>
					<div className="l-container">
						<div className="p-material-requests__header">
							<MultiSelect
								variant="rounded"
								label="Type"
								options={typesList}
								onChange={onMultiTypeChange}
								className="p-material-requests__dropdown"
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
							/>

							<SearchBar
								id="materiaalaanvragen-searchbar"
								default={filters[SEARCH_QUERY_KEY]}
								className="p-material-requests__searchbar"
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
					{currentMaterialRequest?.id && renderDetailBlade()}
				</>
			</CPAdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/beheer/materiaalaanvragen/index___materiaalaanvragen'),
				tText(
					'pages/beheer/materiaalaanvragen/index___materiaalaanvragen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MATERIAL_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(CPMaterialRequestsPage as ComponentType);
