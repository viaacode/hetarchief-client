import {
	Dropdown,
	MenuContent,
	MenuItemInfo,
	OrderDirection,
	Table,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, ReactNode, useMemo, useState } from 'react';
import { SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	getAdminMaterialRequestTableColumns,
} from '@admin/const/material-requests.const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	CP_MATERIAL_REQUEST_TYPE_FITLER_ARRAY,
	CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD,
	CP_MATERIAL_REQUESTS_FILTER_ALL_ID,
} from '@cp/const/material-requests.const';
import { useGetContentPartners } from '@cp/hooks/get-content-partners';
import {
	Icon,
	IconNamesLight,
	Loading,
	PaginationBar,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { globalLabelKeys } from '@shared/const';
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

const AdminMaterialRequests: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
	const [isMaintainerDropdownOpen, setIsMaintainerDropdownOpen] = useState(false);
	const [typeDropdownLabel, setTypeDropdownLabel] = useState(
		tText('pages/admin/materiaalaanvragen/index___type-aanvraag')
	);
	const [maintainerDropdownLabel, setMaintainerDropdownLabel] = useState(
		tText('pages/admin/materiaalaanvragen/index___aanbieder')
	);
	const [filters, setFilters] = useQueryParams(ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);

	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		isPersonal: false,
		size: ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters.page) && { page: filters.page }),
		...(!isNil(filters.orderProp) && { orderProp: filters.orderProp as MaterialRequestKeys }),
		...(!isNil(filters.orderDirection) && {
			orderDirection: filters.orderDirection as OrderDirection,
		}),
		search: filters.search,
		type: filters.type as MaterialRequestType,
		maintainerIds: filters.maintainerIds as string[],
	});

	const { data: maintainers } = useGetContentPartners();

	const getMaintainers = () => {
		const arr = [] as MenuItemInfo[];
		arr.push({
			id: 'ALL',
			label: CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD[CP_MATERIAL_REQUESTS_FILTER_ALL_ID],
		});
		maintainers?.items.map((maintainer) => {
			arr.push({ id: maintainer.id, label: maintainer.name });
		});
		return arr;
	};

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
			start={Math.max(0, filters.page - 1) * ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/admin/materiaalaanvragen/index___geen-materiaalaanvragen');

	const renderContent = (): ReactNode => {
		return (
			<Table<MaterialRequest>
				className="u-mt-24 p-material-requests__table"
				options={{
					columns: getAdminMaterialRequestTableColumns(),
					data: materialRequests?.items || [],
					initialState: {
						pageSize: ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
						sortBy: sortFilters,
					} as TableState<MaterialRequest>,
				}}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				onSortChange={onSortChange}
			/>
		);
	};

	const onTypeClick = (id: string | number): void => {
		setTypeDropdownLabel(CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD[id]);
		if (id === 'ALL') {
			setFilters({ ...filters, type: '' as MaterialRequestType });
		} else {
			setFilters({ ...filters, type: id as MaterialRequestType });
		}
		setIsTypeDropdownOpen(false);
	};

	const onMaintainerClick = (id: string | number): void => {
		const allMaintainers = getMaintainers();
		const selectedMaintainer = allMaintainers.find((maintainer) => maintainer.id === id);
		selectedMaintainer && setMaintainerDropdownLabel(selectedMaintainer.label);

		if (id === 'ALL') {
			setFilters({ ...filters, maintainerIds: [] as string[] });
		} else {
			// Ward: if only 1 id is passed, error is given "maintainerIds must be an array"
			setFilters({ ...filters, maintainerIds: [id, id] as string[] });
		}
		setIsMaintainerDropdownOpen(false);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('pages/admin/materiaalaanvragen/index___materiaalaanvragen')}
			>
				<AdminLayout.Content>
					<div
						className={clsx(
							'l-container l-container--edgeless-to-lg p-admin-material-requests__header'
						)}
					>
						<div className="p-admin-material-requests__header-dropdowns">
							<Dropdown
								variants="filter"
								flyoutClassName="p-admin-material-requests__dropdown--open"
								className="p-admin-material-requests__dropdown"
								label={typeDropdownLabel}
								isOpen={isTypeDropdownOpen}
								onOpen={() => setIsTypeDropdownOpen(true)}
								onClose={() => setIsTypeDropdownOpen(false)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} />}
							>
								<MenuContent
									rootClassName="c-dropdown-menu"
									onClick={onTypeClick}
									menuItems={CP_MATERIAL_REQUEST_TYPE_FITLER_ARRAY}
								/>
							</Dropdown>
							{maintainers && (
								<Dropdown
									variants="filter"
									flyoutClassName="p-admin-material-requests__dropdown--open"
									className="p-admin-material-requests__dropdown"
									label={maintainerDropdownLabel}
									isOpen={isMaintainerDropdownOpen}
									onOpen={() => setIsMaintainerDropdownOpen(true)}
									onClose={() => setIsMaintainerDropdownOpen(false)}
									iconOpen={<Icon name={IconNamesLight.AngleUp} />}
									iconClosed={<Icon name={IconNamesLight.AngleDown} />}
								>
									<MenuContent
										rootClassName="c-dropdown-menu"
										onClick={onMaintainerClick}
										menuItems={getMaintainers()}
									/>
								</Dropdown>
							)}
						</div>

						<SearchBar
							id={globalLabelKeys.adminLayout.title}
							default={filters.search}
							placeholder={tText('pages/admin/materiaalaanvragen/index___zoek')}
							onSearch={(value) => setFilters({ search: value, page: 1 })}
						/>
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
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText('pages/admin/materiaalaanvragen/index___materiaalaanvragen'),
				tText(
					'pages/admin/materiaalaanvragen/index___materiaalaanvragen-meta-omschrijving'
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

export default withAuth(AdminMaterialRequests as ComponentType);
