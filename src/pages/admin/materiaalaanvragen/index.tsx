import { MultiSelect, MultiSelectOption, OrderDirection, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil, without } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { Row, SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import MaterialRequestDetailBlade from '@account/components/MaterialRequestDetailBlade/MaterialRequestDetailBlade';
import { Permission } from '@account/const';
import {
	ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	GET_ADMIN_MATERIAL_REQUEST_TYPE_FILTER_ARRAY,
	getAdminMaterialRequestTableColumns,
} from '@admin/const/material-requests.const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { useGetMaterialRequestsMaintainers } from '@material-requests/hooks/get-material-requests-maintainers';
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
import { globalLabelKeys } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const AdminMaterialRequests: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();
	const [selectedMaintainers, setSelectedMaintainers] = useState<string[]>([]);
	const [filters, setFilters] = useQueryParams(ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const { data: materialRequests, isLoading: isLoadingMaterialRequests } = useGetMaterialRequests(
		{
			isPersonal: false,
			isPending: false,
			size: ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
			...(!isNil(filters.page) && { page: filters.page }),
			...(!isNil(filters.orderProp) && {
				orderProp: filters.orderProp as MaterialRequestKeys,
			}),
			...(!isNil(filters.orderDirection) && {
				orderDirection: filters.orderDirection as OrderDirection,
			}),
			search: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
			type: filters.type as MaterialRequestType[],
			maintainerIds: filters.maintainerIds as string[],
		}
	);

	const { data: maintainers } = useGetMaterialRequestsMaintainers();

	const maintainerList = useMemo(() => {
		if (maintainers) {
			return [
				...maintainers.map(
					({ id, name }): MultiSelectOption => ({
						id,
						label: name,
						checked: selectedMaintainers.includes(id),
					})
				),
			];
		}
	}, [maintainers, selectedMaintainers]);

	const typesList = useMemo(() => {
		return [
			...GET_ADMIN_MATERIAL_REQUEST_TYPE_FILTER_ARRAY().map(
				({ id, label }): MultiSelectOption => ({
					id,
					label,
					checked: ((filters.type as string[] | null) || []).includes(id),
				})
			),
		];
	}, [filters]);

	const { data: currentMaterialRequestDetail, isFetching: isLoading } = useGetMaterialRequestById(
		currentMaterialRequest?.id || null
	);

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
		if (!orderProp) {
			orderProp = 'createdAt';
		}
		if (!orderDirection) {
			orderDirection = OrderDirection.desc;
		}
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
			start={Math.max(0, filters.page - 1) * ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/admin/materiaalaanvragen/index___geen-materiaalaanvragen');

	const onRowClick = (evt: MouseEvent<HTMLTableRowElement>, row: Row<MaterialRequest>) => {
		setCurrentMaterialRequest(row.original);
		setIsDetailBladeOpen(true);
	};

	const renderDetailBlade = () => {
		return (
			<MaterialRequestDetailBlade
				isOpen={!isLoading && isDetailBladeOpen}
				onClose={() => setIsDetailBladeOpen(false)}
				currentMaterialRequestDetail={currentMaterialRequestDetail}
			/>
		);
	};

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
				onRowClick={onRowClick}
			/>
		);
	};

	// Note: Internal selected IDs state
	const onMultiTypeChange = (checked: boolean, id: string) => {
		const newSelectedTypes = !checked ? [...filters.type, id] : without(filters.type, id);
		setFilters({
			...filters,
			type: newSelectedTypes,
			page: 1,
		});
	};

	const onMultiMaintainersChange = (checked: boolean, id: string) => {
		setSelectedMaintainers((prev) => (!checked ? [...prev, id] : without(prev, id)));
	};

	useEffect(() => {
		setFilters({
			...filters,
			maintainerIds: selectedMaintainers,
			page: 1,
		});
	}, [selectedMaintainers]);

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
							<MultiSelect
								variant="rounded"
								label="Type"
								options={typesList}
								onChange={onMultiTypeChange}
								className="p-admin-material-requests__dropdown"
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
							/>
							{maintainerList && (
								<MultiSelect
									variant="rounded"
									label={tText(
										'pages/admin/materiaalaanvragen/index___aanbieder'
									)}
									options={maintainerList}
									onChange={onMultiMaintainersChange}
									className="p-admin-material-requests__dropdown c-multi-select"
									iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
									iconClosed={
										<Icon name={IconNamesLight.AngleDown} aria-hidden />
									}
									iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								/>
							)}
						</div>

						<SearchBar
							id={globalLabelKeys.adminLayout.title}
							value={search}
							placeholder={tText('pages/admin/materiaalaanvragen/index___zoek')}
							onChange={setSearch}
							onSearch={(newValue) =>
								setFilters({
									[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: newValue || undefined,
									page: 1,
								})
							}
						/>
					</div>
					<div
						className={clsx('l-container l-container--edgeless-to-lg', {
							'u-text-center u-color-neutral u-py-48':
								isLoadingMaterialRequests || noData,
						})}
					>
						{isLoadingMaterialRequests && (
							<Loading owner="Material requests overview" />
						)}
						{noData && renderEmptyMessage()}
						{!noData && !isLoadingMaterialRequests && renderContent()}
					</div>
					{currentMaterialRequest?.id && renderDetailBlade()}
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

export default withAuth(AdminMaterialRequests as ComponentType, true);
