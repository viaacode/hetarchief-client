import {
	MultiSelect,
	type MultiSelectOption,
	OrderDirection,
	PaginationBar,
	Table,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil, without } from 'lodash-es';
import React, {
	type FC,
	type MouseEvent,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { Row, SortingRule, TableState } from 'react-table';
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
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { useGetMaterialRequestsMaintainers } from '@material-requests/hooks/get-material-requests-maintainers';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	type MaterialRequestType,
} from '@material-requests/types';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { globalLabelKeys } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';

export const AdminMaterialRequests: FC<DefaultSeoInfo> = ({ url }) => {
	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();
	const [selectedMaintainers, setSelectedMaintainers] = useState<string[]>([]);
	const [filters, setFilters] = useQueryParams(ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const { data: materialRequests, isLoading: isLoadingMaterialRequests } = useGetMaterialRequests({
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
	});

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
	}, [filters.type]);

	const { data: currentMaterialRequestDetail, isFetching: isLoading } = useGetMaterialRequestById(
		currentMaterialRequest?.id || null
	);

	const noData = useMemo(
		(): boolean => isEmpty(materialRequests?.items),
		[materialRequests?.items]
	);

	const sortFilters = useMemo(
		(): SortingRule<{ id: MaterialRequestKeys; desc: boolean }>[] => [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== OrderDirection.asc,
			},
		],
		[filters.orderProp, filters.orderDirection]
	);

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	): void => {
		if (filters.orderProp === MaterialRequestKeys.createdAt && orderDirection === undefined) {
			setFilters({
				...filters,
				orderProp: orderProp || 'createdAt',
				orderDirection: OrderDirection.asc,
				page: 1,
			});
		} else if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp: orderProp || 'createdAt',
				orderDirection: orderDirection || OrderDirection.desc,
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
			{...getDefaultPaginationBarProps()}
			startItem={Math.max(0, filters.page - 1) * ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			totalItems={materialRequests?.total || 0}
			itemsPerPage={ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to set the filters if selectedMaintainers changes, but we cannot set it as a dependency or we get a loop
	useEffect(() => {
		setFilters({
			...filters,
			maintainerIds: selectedMaintainers,
			page: 1,
		});
	}, [selectedMaintainers]);

	const renderPageContent = () => {
		return (
			<AdminLayout pageTitle={tText('pages/admin/materiaalaanvragen/index___materiaalaanvragen')}>
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
									label={tText('pages/admin/materiaalaanvragen/index___aanbieder')}
									options={maintainerList}
									onChange={onMultiMaintainersChange}
									className="p-admin-material-requests__dropdown c-multi-select"
									iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
									iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
									iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								/>
							)}
						</div>

						<SearchBar
							id={globalLabelKeys.adminLayout.title}
							value={search}
							aria-label={tText(
								'modules/admin/views/admin-material-requests___zoekbalk-aria-label'
							)}
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
							'u-text-center u-color-neutral u-py-48': isLoadingMaterialRequests || noData,
						})}
					>
						{isLoadingMaterialRequests && <Loading owner="Material requests overview" />}
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
			<SeoTags
				title={tText('pages/admin/materiaalaanvragen/index___materiaalaanvragen')}
				description={tText(
					'pages/admin/materiaalaanvragen/index___materiaalaanvragen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MATERIAL_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
