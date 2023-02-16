import { Dropdown, MenuContent, OrderDirection, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, ReactNode, useMemo, useState } from 'react';
import { SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	CP_MATERIAL_REQUEST_TYPE_FITLER_ARRAY,
	CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD,
	CP_MATERIAL_REQUESTS_FILTER_ALL_ID,
	CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	CpMaterialRequestTableColumns,
} from '@cp/const/material-requests.const';
import { CPAdminLayout } from '@cp/layouts';
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

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import {
	MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestType,
} from '@material-requests/types';

const CPMaterialRequestsPage: NextPage<DefaultSeoInfo> = ({ url }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [dropdownLabel, setDropdownLabel] = useState<string>(
		CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD[CP_MATERIAL_REQUESTS_FILTER_ALL_ID]
	);

	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		size: CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
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

	const onTypeClick = (id: string | number): void => {
		const showAll = id === CP_MATERIAL_REQUESTS_FILTER_ALL_ID;
		setDropdownLabel(CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD[id]);
		setIsDropdownOpen(false);

		setFilters({
			type: showAll ? undefined : `${id}`,
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
			start={Math.max(0, filters.page - 1) * CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/beheer/materiaalaanvragen/index___geen-materiaal-aanvragen');

	const renderContent = (): ReactNode => {
		return (
			<Table<MaterialRequest>
				className="u-mt-24 p-material-requests__table"
				options={{
					columns: CpMaterialRequestTableColumns(),
					data: materialRequests?.items || [],
					initialState: {
						pageSize: CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
						sortBy: sortFilters,
					} as TableState<MaterialRequest>,
				}}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				onSortChange={onSortChange}
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
							<Dropdown
								variants="filter"
								flyoutClassName="p-material-requests__dropdown--open"
								className="p-material-requests__dropdown"
								label={dropdownLabel}
								isOpen={isDropdownOpen}
								onOpen={() => setIsDropdownOpen(true)}
								onClose={() => setIsDropdownOpen(false)}
								// iconOpen={<Icon name={IconNamesLight.AngleUp} />}
								// iconClosed={<Icon name={IconNamesLight.AngleDown} />}
							>
								<MenuContent
									rootClassName="c-dropdown-menu"
									onClick={onTypeClick}
									menuItems={CP_MATERIAL_REQUEST_TYPE_FITLER_ARRAY}
								/>
							</Dropdown>
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
