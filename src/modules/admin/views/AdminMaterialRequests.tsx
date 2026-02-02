import MaterialRequestDetailBlade from '@account/components/MaterialRequestDetailBlade/MaterialRequestDetailBlade';
import MaterialRequestStatusUpdateBlade from '@account/components/MaterialRequestStatusUpdateBlade/MaterialRequestStatusUpdateBlade';
import {
	GET_MATERIAL_REQUEST_DOWNLOAD_FILTER_ARRAY,
	GET_MATERIAL_REQUEST_STATUS_FILTER_ARRAY,
	Permission,
} from '@account/const';
import {
	ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	GET_ADMIN_MATERIAL_REQUEST_TYPE_FILTER_ARRAY,
	getAdminMaterialRequestTableColumns,
} from '@admin/const/material-requests.const';
import { AdminLayout } from '@admin/layouts';
import { getMaterialRequestTableColumnProps } from '@material-requests/const';
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { useGetMaterialRequestsMaintainers } from '@material-requests/hooks/get-material-requests-maintainers';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestStatus,
	type MaterialRequestType,
} from '@material-requests/types';
import {
	MultiSelect,
	type MultiSelectOption,
	PaginationBar,
	Table,
} from '@meemoo/react-components';
import { BladeManager } from '@shared/components/BladeManager';
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
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import clsx from 'clsx';
import { isEmpty, isNil, noop } from 'lodash-es';
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

export const AdminMaterialRequests: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [isDetailStatusBladeOpenWithStatus, setIsDetailStatusBladeOpenWithStatus] = useState<
		MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED | undefined
	>(undefined);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();
	const [filters, setFilters] = useQueryParams(ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const [selectedMaintainers, setSelectedMaintainers] = useState<string[]>(
		(filters.maintainerIds || []) as string[]
	);
	const [selectedTypes, setSelectedTypes] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.TYPE] || []) as string[]
	);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.STATUS] || []) as string[]
	);
	const [selectedDownloadFilters, setSelectedDownloadFilters] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.HAS_DOWNLOAD_URL] || []) as string[]
	);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const {
		data: materialRequests,
		isLoading: isLoadingMaterialRequests,
		refetch: refetchMaterialRequests,
	} = useGetMaterialRequests({
		isPersonal: false,
		isPending: false,
		size: ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters.page) && { page: filters.page }),
		...(!isNil(filters.orderProp) && {
			orderProp: filters.orderProp as MaterialRequestKeys,
		}),
		...(!isNil(filters.orderDirection) && {
			orderDirection: filters.orderDirection as AvoSearchOrderDirection,
		}),
		search: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		...(!isNil(filters.type) && {
			type: filters.type as MaterialRequestType[],
		}),
		...(!isNil(filters.status) && {
			status: filters.status as MaterialRequestStatus[],
		}),
		...(!isNil(filters.hasDownloadUrl) && {
			hasDownloadUrl: filters.hasDownloadUrl as string[],
		}),
		maintainerIds: filters.maintainerIds as string[],
	});

	const { data: maintainers } = useGetMaterialRequestsMaintainers();

	const maintainerList = useMemo(() => {
		if (maintainers) {
			return [
				...(maintainers || []).map(
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
					checked: selectedTypes.includes(id),
				})
			),
		];
	}, [selectedTypes]);

	const statusList = useMemo(() => {
		return [
			...GET_MATERIAL_REQUEST_STATUS_FILTER_ARRAY().map(
				({ id, label }): MultiSelectOption => ({
					id,
					label,
					checked: selectedStatuses.includes(id),
				})
			),
		];
	}, [selectedStatuses]);

	const downloadUrlList = useMemo(() => {
		return [
			...GET_MATERIAL_REQUEST_DOWNLOAD_FILTER_ARRAY().map(
				({ id, label }): MultiSelectOption => ({
					id,
					label,
					checked: selectedDownloadFilters.includes(id),
				})
			),
		];
	}, [selectedDownloadFilters]);

	const {
		data: currentMaterialRequestDetail,
		isFetching: isLoading,
		refetch: refetchCurrentMaterialRequestDetail,
	} = useGetMaterialRequestById(currentMaterialRequest?.id || null);

	const noData = useMemo(
		(): boolean => isEmpty(materialRequests?.items),
		[materialRequests?.items]
	);

	const sortFilters = useMemo(
		(): SortingRule<{ id: MaterialRequestKeys; desc: boolean }>[] => [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== AvoSearchOrderDirection.ASC,
			},
		],
		[filters.orderProp, filters.orderDirection]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		setFilters({
			...filters,
			type: selectedTypes,
			page: 1,
		});
	}, [selectedTypes]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		setFilters({
			...filters,
			status: selectedStatuses,
			page: 1,
		});
	}, [selectedStatuses]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		setFilters({
			...filters,
			hasDownloadUrl: selectedDownloadFilters,
			page: 1,
		});
	}, [selectedDownloadFilters]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to set the filters if selectedMaintainers changes, but we cannot set it as a dependency or we get a loop
	useEffect(() => {
		setFilters({
			...filters,
			maintainerIds: selectedMaintainers,
			page: 1,
		});
	}, [selectedMaintainers]);

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: AvoSearchOrderDirection | undefined
	): void => {
		if (filters.orderProp === MaterialRequestKeys.requestedAt && orderDirection === undefined) {
			setFilters({
				...filters,
				orderProp: orderProp || 'requestedAt',
				orderDirection: AvoSearchOrderDirection.ASC,
				page: 1,
			});
		} else if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp: orderProp || 'requestedAt',
				orderDirection: orderDirection || AvoSearchOrderDirection.DESC,
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
			showFirstAndLastButtons
			{...getDefaultPaginationBarProps()}
			startItem={Math.max(0, filters.page - 1) * ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			totalItems={materialRequests?.total || 0}
			itemsPerPage={ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/admin/materiaalaanvragen/index___geen-materiaalaanvragen');

	const onRowClick = (_evt: MouseEvent<HTMLTableRowElement>, row: Row<MaterialRequest>) => {
		setCurrentMaterialRequest(row.original);
		setIsDetailBladeOpen(true);
	};

	const onMaterialRequestStatusChange = () => {
		void refetchCurrentMaterialRequestDetail();
		void refetchMaterialRequests();
	};

	const renderDetailBlade = () => {
		if (!currentMaterialRequest?.id || !currentMaterialRequestDetail) {
			return null;
		}

		const getBladeLayerIndex = () => {
			if (isDetailStatusBladeOpenWithStatus) {
				return 2;
			}

			if (isDetailBladeOpen) {
				return 1;
			}
			return 0;
		};

		return (
			<BladeManager
				currentLayer={getBladeLayerIndex()}
				onCloseBlade={() => {
					if (isDetailStatusBladeOpenWithStatus) {
						setIsDetailStatusBladeOpenWithStatus(undefined);
					} else {
						setIsDetailBladeOpen(false);
					}
				}}
				opacityStep={0.1}
			>
				<MaterialRequestDetailBlade
					allowRequestCancellation={false}
					isOpen={!isLoading && isDetailBladeOpen}
					onClose={() => setIsDetailBladeOpen(false)}
					onApproveRequest={() =>
						setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.APPROVED)
					}
					onDeclineRequest={() =>
						setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.DENIED)
					}
					currentMaterialRequestDetail={currentMaterialRequestDetail}
					afterStatusChanged={onMaterialRequestStatusChange}
					layer={isDetailBladeOpen ? 1 : 99}
					currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
				/>
				<MaterialRequestStatusUpdateBlade
					isOpen={!isLoading && !!isDetailStatusBladeOpenWithStatus}
					onClose={() => setIsDetailStatusBladeOpenWithStatus(undefined)}
					status={isDetailStatusBladeOpenWithStatus}
					currentMaterialRequestDetail={currentMaterialRequestDetail}
					afterStatusChanged={onMaterialRequestStatusChange}
					layer={isDetailBladeOpen ? 2 : 99}
					currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
				/>
			</BladeManager>
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
				getColumnProps={getMaterialRequestTableColumnProps}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				onSortChange={onSortChange}
				onRowClick={onRowClick}
				showTable={!noData && !isLoadingMaterialRequests}
				enableRowFocusOnClick={true}
			/>
		);
	};

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
								label={tText('pages/admin/materiaalaanvragen/index___type')}
								options={typesList}
								onChange={noop}
								className={clsx(
									'p-admin-material-requests__dropdown',
									'p-admin-material-requests__dropdown-no-dividers'
								)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								checkboxHeader={tText('pages/admin/materiaalaanvragen/index___type-aanvraag')}
								confirmOptions={{
									label: tText('pages/admin/materiaalaanvragen/index___pas-toe'),
									variants: ['black'],
									onClick: setSelectedTypes,
								}}
								resetOptions={{
									icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
									label: tText('pages/admin/materiaalaanvragen/index___reset'),
									variants: ['text'],
									onClick: setSelectedTypes,
								}}
							/>

							<MultiSelect
								variant="rounded"
								label={tText('pages/admin/materiaalaanvragen/index___status')}
								options={statusList}
								onChange={noop}
								className={clsx(
									'p-admin-material-requests__dropdown',
									'p-admin-material-requests__dropdown-no-dividers'
								)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								checkboxHeader={tText('pages/admin/materiaalaanvragen/index___status-aanvraag')}
								confirmOptions={{
									label: tText('pages/admin/materiaalaanvragen/index___pas-toe'),
									variants: ['black'],
									onClick: setSelectedStatuses,
								}}
								resetOptions={{
									icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
									label: tText('pages/admin/materiaalaanvragen/index___reset'),
									variants: ['text'],
									onClick: setSelectedStatuses,
								}}
							/>

							<MultiSelect
								variant="rounded"
								label={tText('pages/admin/materiaalaanvragen/index___download')}
								options={downloadUrlList}
								onChange={noop}
								className={clsx(
									'p-admin-material-requests__dropdown',
									'p-admin-material-requests__dropdown-no-dividers'
								)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								checkboxHeader={tText(
									'pages/admin/materiaalaanvragen/index___aanvraag-met-download'
								)}
								confirmOptions={{
									label: tText('pages/admin/materiaalaanvragen/index___pas-toe'),
									variants: ['black'],
									onClick: setSelectedDownloadFilters,
								}}
								resetOptions={{
									icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
									label: tText('pages/admin/materiaalaanvragen/index___reset'),
									variants: ['text'],
									onClick: setSelectedDownloadFilters,
								}}
							/>
							{maintainerList && (
								<MultiSelect
									variant="rounded"
									label={tText('pages/admin/materiaalaanvragen/index___aanbieder')}
									options={maintainerList}
									onChange={noop}
									className={clsx(
										'p-admin-material-requests__dropdown',
										'p-admin-material-requests__dropdown-no-dividers'
									)}
									iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
									iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
									iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
									checkboxHeader={tText(
										'pages/admin/materiaalaanvragen/index___aanbieder-aanvraag'
									)}
									confirmOptions={{
										label: tText('pages/admin/materiaalaanvragen/index___pas-toe'),
										variants: ['black'],
										onClick: setSelectedMaintainers,
									}}
									resetOptions={{
										icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
										label: tText('pages/admin/materiaalaanvragen/index___reset'),
										variants: ['text'],
										onClick: setSelectedMaintainers,
									}}
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
						{noData && !isLoadingMaterialRequests && renderEmptyMessage()}
						{renderContent()}
					</div>
					{renderDetailBlade()}
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
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.VIEW_ANY_MATERIAL_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
