import MaterialRequestDetailBlade from '@account/components/MaterialRequestDetailBlade/MaterialRequestDetailBlade';
import MaterialRequestStatusUpdateBlade from '@account/components/MaterialRequestStatusUpdateBlade/MaterialRequestStatusUpdateBlade';
import {
	GET_MATERIAL_REQUEST_DOWNLOAD_FILTER_ARRAY,
	GET_MATERIAL_REQUEST_STATUS_FILTER_ARRAY,
	Permission,
} from '@account/const';
import { selectUser } from '@auth/store/user';
import {
	CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	GET_CP_MATERIAL_REQUEST_TYPE_FILTER_ARRAY,
	getMaterialRequestTableColumns,
} from '@cp/const/material-requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { getAccountMaterialRequestTableColumnProps } from '@material-requests/const';
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
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
import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import clsx from 'clsx';
import { isEmpty, isNil, noop } from 'lodash-es';
import { type FC, type MouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { Row, SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

export const CpAdminMaterialRequests: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const [filters, setFilters] = useQueryParams(CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');
	const [selectedTypes, setSelectedTypes] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.TYPE] || []) as string[]
	);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.STATUS] || []) as string[]
	);
	const [selectedDownloadFilters, setSelectedDownloadFilters] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.HAS_DOWNLOAD_URL] || []) as string[]
	);

	const user = useSelector(selectUser);
	const locale = useLocale();

	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [isDetailStatusBladeOpenWithStatus, setIsDetailStatusBladeOpenWithStatus] = useState<
		MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED | undefined
	>(undefined);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();
	const {
		data: materialRequests,
		isFetching,
		refetch: refetchMaterialRequests,
	} = useGetMaterialRequests({
		isPending: false,
		size: CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]) && {
			search: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		}),
		...(!isNil(filters.page) && { page: filters.page }),
		...(!isNil(filters.type) && {
			type: filters.type as MaterialRequestType[],
		}),
		...(!isNil(filters.status) && {
			status: filters.status as MaterialRequestStatus[],
		}),
		...(!isNil(filters.hasDownloadUrl) && {
			hasDownloadUrl: filters.hasDownloadUrl as string[],
		}),
		...(!isNil(filters.orderProp) && {
			orderProp: filters.orderProp as MaterialRequestKeys,
		}),
		...(!isNil(filters.orderDirection) && {
			orderDirection: filters.orderDirection as AvoSearchOrderDirection,
		}),
		...(user?.organisationId ? { maintainerIds: [user.organisationId] } : {}),
	});

	const {
		data: currentMaterialRequestDetail,
		isFetching: isLoading,
		refetch: refetchCurrentMaterialRequestDetail,
	} = useGetMaterialRequestById(currentMaterialRequest?.id || null);

	const noData = useMemo(
		(): boolean => isEmpty(materialRequests?.items),
		[materialRequests?.items]
	);

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

	const onMaterialRequestStatusChange = () => {
		void refetchCurrentMaterialRequestDetail();
		void refetchMaterialRequests();
	};

	const renderPagination = ({ gotoPage }: { gotoPage: (i: number) => void }): ReactNode => (
		<PaginationBar
			{...getDefaultPaginationBarProps()}
			startItem={Math.max(0, filters.page - 1) * CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			totalItems={materialRequests?.total || 0}
			itemsPerPage={CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/beheer/materiaalaanvragen/index___geen-materiaal-aanvragen');

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

	const onRowClick = async (_evt: MouseEvent<HTMLTableRowElement>, row: Row<MaterialRequest>) => {
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
				getColumnProps={getAccountMaterialRequestTableColumnProps}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				onSortChange={onSortChange}
				onRowClick={onRowClick}
				showTable={!noData && !isFetching}
				enableRowFocusOnClick={true}
			/>
		);
	};

	const renderPageTitle = () => (
		<>
			{tText('pages/beheer/materiaalaanvragen/index___materiaalaanvragen')}
			<div className="u-color-neutral u-font-size-14 u-font-weight-400 u-pt-8">
				<a
					href={ROUTES_BY_LOCALE[locale].accountMyMaterialRequests}
					target="_blank"
					rel="noopener noreferrer"
				>
					{tText(
						'modules/cp/views/cp-admin-material-requests___ga-naar-mijn-uitgaande-materiaalaanvragen'
					)}
				</a>
				<Icon className="u-ml-8" name={IconNamesLight.Extern} />
			</div>
		</>
	);

	const renderPageContent = () => {
		return (
			<CPAdminLayout className="p-material-requests" pageTitle={renderPageTitle()}>
				<div className="l-container">
					<div className="p-material-requests__header">
						<div className={clsx('u-flex', 'u-flex-row', 'u-gap-sm')}>
							<MultiSelect
								variant="rounded"
								label={tText('modules/cp/views/cp-admin-material-requests___type')}
								options={typesList}
								onChange={noop}
								className={clsx(
									'p-material-requests__dropdown',
									'p-material-requests__dropdown-no-dividers'
								)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								checkboxHeader={tText(
									'modules/cp/views/cp-admin-material-requests___type-aanvraag'
								)}
								confirmOptions={{
									label: tText('modules/cp/views/cp-admin-material-requests___pas-toe'),
									variants: ['black'],
									onClick: setSelectedTypes,
								}}
								resetOptions={{
									icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
									label: tText('modules/cp/views/cp-admin-material-requests___reset'),
									variants: ['text'],
									onClick: setSelectedTypes,
								}}
							/>

							<MultiSelect
								variant="rounded"
								label={tText('modules/cp/views/cp-admin-material-requests___status')}
								options={statusList}
								onChange={noop}
								className={clsx(
									'p-material-requests__dropdown',
									'p-material-requests__dropdown-no-dividers'
								)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								checkboxHeader={tText(
									'modules/cp/views/cp-admin-material-requests___status-aanvraag'
								)}
								confirmOptions={{
									label: tText('modules/cp/views/cp-admin-material-requests___pas-toe'),
									variants: ['black'],
									onClick: setSelectedStatuses,
								}}
								resetOptions={{
									icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
									label: tText('modules/cp/views/cp-admin-material-requests___reset'),
									variants: ['text'],
									onClick: setSelectedStatuses,
								}}
							/>

							<MultiSelect
								variant="rounded"
								label={tText('modules/cp/views/cp-admin-material-requests___download')}
								options={downloadUrlList}
								onChange={noop}
								className={clsx(
									'p-material-requests__dropdown',
									'p-material-requests__dropdown-no-dividers'
								)}
								iconOpen={<Icon name={IconNamesLight.AngleUp} aria-hidden />}
								iconClosed={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
								iconCheck={<Icon name={IconNamesLight.Check} aria-hidden />}
								checkboxHeader={tText(
									'modules/cp/views/cp-admin-material-requests___aanvraag-met-download'
								)}
								confirmOptions={{
									label: tText('modules/cp/views/cp-admin-material-requests___pas-toe'),
									variants: ['black'],
									onClick: setSelectedDownloadFilters,
								}}
								resetOptions={{
									icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
									label: tText('modules/cp/views/cp-admin-material-requests___reset'),
									variants: ['text'],
									onClick: setSelectedDownloadFilters,
								}}
							/>
						</div>

						<SearchBar
							id="materiaalaanvragen-searchbar"
							value={search}
							className="p-material-requests__searchbar"
							placeholder={tText('pages/beheer/materiaalaanvragen/index___zoek')}
							onChange={setSearch}
							onSearch={(newValue) =>
								setFilters({
									[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: newValue,
									page: 1,
								})
							}
						/>
					</div>
				</div>

				<div
					className={clsx('l-container l-container--edgeless-to-lg', {
						'u-text-center u-color-neutral u-py-48': isFetching || noData,
					})}
				>
					{isFetching && <Loading owner="Material requests overview" />}
					{noData && !isFetching && renderEmptyMessage()}
					{renderContent()}
				</div>
				{renderDetailBlade()}
			</CPAdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={`${tText('pages/beheer/materiaalaanvragen/index___materiaalaanvragen')} | ${tText('modules/cp/views/cp-admin-material-requests___beheer')} `}
				description={tText(
					'pages/beheer/materiaalaanvragen/index___materiaalaanvragen-meta-omschrijving'
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
