import MaterialRequestDetailBlade from '@account/components/MaterialRequestDetailBlade/MaterialRequestDetailBlade';
import {
	ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	GET_MATERIAL_REQUEST_DOWNLOAD_FILTER_ARRAY,
	GET_MATERIAL_REQUEST_STATUS_FILTER_ARRAY,
	GET_MATERIAL_REQUEST_TYPE_FILTER_ARRAY,
	GroupName,
	getAccountMaterialRequestTableColumns,
	Permission,
} from '@account/const';
import { AccountLayout } from '@account/layouts';
import { getMaterialRequestTableColumnProps } from '@material-requests/const';
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	type MaterialRequestStatus,
	type MaterialRequestType,
} from '@material-requests/types';
import {
	MultiSelect,
	type MultiSelectOption,
	PaginationBar,
	type Row,
	Table,
} from '@meemoo/react-components';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
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
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { VisitorLayout } from '@visitor-layout/index';
import clsx from 'clsx';
import { isEmpty, isNil, noop } from 'lodash-es';
import Link from 'next/link';
import { type FC, type MouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import type { SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

export const AccountMyMaterialRequests: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const [filters, setFilters] = useQueryParams(ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');
	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();
	const [selectedTypes, setSelectedTypes] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.TYPE] || []) as string[]
	);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.STATUS] || []) as string[]
	);
	const [selectedDownloadFilters, setSelectedDownloadFilters] = useState<string[]>(
		(filters[QUERY_PARAM_KEY.HAS_DOWNLOAD_URL] || []) as string[]
	);

	const hasOwnMaterialRequestsPerm = useHasAnyPermission(Permission.VIEW_OWN_MATERIAL_REQUESTS);
	const hasAnyMaterialRequestsPerm = useHasAnyPermission(Permission.VIEW_ANY_MATERIAL_REQUESTS);
	const locale = useLocale();
	const isKeyUser = useIsKeyUser();
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);

	const {
		data: currentMaterialRequestDetail,
		isFetching: isLoading,
		refetch: refetchCurrentMaterialRequestDetail,
	} = useGetMaterialRequestById(currentMaterialRequest?.id || null);
	const {
		data: materialRequests,
		refetch: refetchMaterialRequests,
		isFetching,
	} = useGetMaterialRequests({
		isPersonal: true,
		isPending: false,
		size: ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters.page) && { page: filters.page }),
		...(!isNil(filters.orderProp) && {
			orderProp: filters.orderProp as MaterialRequestKeys,
		}),
		...(!isNil(filters.orderDirection) && {
			orderDirection: filters.orderDirection as AvoSearchOrderDirection,
		}),
		...(!isNil(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]) && {
			search: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		}),
		...(!isNil(filters.type) && {
			type: filters.type as MaterialRequestType[],
		}),
		...(!isNil(filters.status) && {
			status: filters.status as MaterialRequestStatus[],
		}),
		...(!isNil(filters.hasDownloadUrl) && {
			hasDownloadUrl: filters.hasDownloadUrl as string[],
		}),
	});

	const noData = useMemo((): boolean => isEmpty(materialRequests?.items), [materialRequests]);

	const typesList = useMemo(() => {
		return [
			...GET_MATERIAL_REQUEST_TYPE_FILTER_ARRAY().map(
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
		[filters]
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
				orderProp,
				orderDirection: AvoSearchOrderDirection.ASC,
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
			{...getDefaultPaginationBarProps()}
			startItem={Math.max(0, filters.page - 1) * ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			totalItems={materialRequests?.total || 0}
			itemsPerPage={ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/account/mijn-profiel/index___geen-materiaal-aanvragen');

	const onRowClick = (_evt: MouseEvent<HTMLTableRowElement>, row: Row<MaterialRequest>) => {
		if (row.original.id === currentMaterialRequest?.id) {
			// In case we open the same request, refetch it to make sure we have the latest status
			void refetchCurrentMaterialRequestDetail();
		}
		setCurrentMaterialRequest(row.original);
		setIsDetailBladeOpen(true);
	};

	const onMaterialRequestStatusChange = () => {
		void refetchCurrentMaterialRequestDetail();
		void refetchMaterialRequests();
	};

	const renderDetailBlade = () => {
		if (!currentMaterialRequestDetail) {
			return null;
		}
		return (
			<MaterialRequestDetailBlade
				allowRequestCancellation={true}
				isOpen={!isLoading && isDetailBladeOpen}
				onClose={() => setIsDetailBladeOpen(false)}
				currentMaterialRequestDetail={currentMaterialRequestDetail}
				afterStatusChanged={onMaterialRequestStatusChange}
			/>
		);
	};

	const renderContent = (): ReactNode => {
		return (
			<Table<MaterialRequest>
				className="u-mt-24 p-material-requests__table p-account-my-material-requests__table"
				options={{
					columns: getAccountMaterialRequestTableColumns(isKeyUser),
					data: materialRequests?.items || [],
					initialState: {
						pageSize: ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
						sortBy: sortFilters,
					} as TableState<MaterialRequest>,
				}}
				getColumnProps={getMaterialRequestTableColumnProps}
				sortingIcons={sortingIcons}
				pagination={renderPagination}
				onSortChange={onSortChange}
				onRowClick={onRowClick}
				showTable={!noData && !isFetching}
				enableRowFocusOnClick={true}
			/>
		);
	};

	const renderPageTitle = () => {
		const incomingRequestLabel = isMeemooAdmin
			? tText(
					'modules/account/views/account-my-material-requests___ga-naar-de-alle-materiaalaanvragen'
				)
			: tText(
					'modules/account/views/account-my-material-requests___ga-naar-de-inkomende-materiaalaanvragen-van-mijn-organisatie'
				);
		const incomingRequestHyperlink = isMeemooAdmin
			? ROUTES_BY_LOCALE[locale].adminMaterialRequests
			: ROUTES_BY_LOCALE[locale].cpAdminMaterialRequests;

		return (
			<>
				{tText('pages/account/mijn-profiel/index___mijn-materiaalaanvragen')}
				{hasAnyMaterialRequestsPerm && (
					<div className="u-color-neutral u-font-size-14 u-font-weight-400 u-pt-8">
						<Link href={incomingRequestHyperlink}>{incomingRequestLabel}</Link>
					</div>
				)}
			</>
		);
	};

	const renderPageContent = () => {
		if (!hasOwnMaterialRequestsPerm) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={null}
					description={tHtml(
						'modules/shared/components/error-no-access/error-no-access___je-hebt-geen-toegang-tot-deze-pagina'
					)}
				/>
			);
		}
		return (
			<AccountLayout className="p-account-my-material-requests" pageTitle={renderPageTitle()}>
				<div
					className={clsx('l-container l-container--edgeless-to-lg', {
						'u-text-center u-color-neutral u-py-48': isFetching || noData,
					})}
				>
					{isKeyUser && (
						<div className="l-container">
							<div className="p-material-requests__header">
								<div className={clsx('u-flex', 'u-flex-row', 'u-gap-sm')}>
									<MultiSelect
										variant="rounded"
										label={tText('modules/account/views/account-my-material-requests___type')}
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
											'modules/account/views/account-my-material-requests___type-aanvraag'
										)}
										confirmOptions={{
											label: tText('modules/account/views/account-my-material-requests___pas-toe'),
											variants: ['black'],
											onClick: setSelectedTypes,
										}}
										resetOptions={{
											icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
											label: tText('modules/account/views/account-my-material-requests___reset'),
											variants: ['text'],
											onClick: setSelectedTypes,
										}}
									/>

									<MultiSelect
										variant="rounded"
										label={tText('modules/account/views/account-my-material-requests___status')}
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
											'modules/account/views/account-my-material-requests___status-aanvraag'
										)}
										confirmOptions={{
											label: tText('modules/account/views/account-my-material-requests___pas-toe'),
											variants: ['black'],
											onClick: setSelectedStatuses,
										}}
										resetOptions={{
											icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
											label: tText('modules/account/views/account-my-material-requests___reset'),
											variants: ['text'],
											onClick: setSelectedStatuses,
										}}
									/>

									<MultiSelect
										variant="rounded"
										label={tText('modules/account/views/account-my-material-requests___download')}
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
											'modules/account/views/account-my-material-requests___aanvraag-met-download'
										)}
										confirmOptions={{
											label: tText('modules/account/views/account-my-material-requests___pas-toe'),
											variants: ['black'],
											onClick: setSelectedDownloadFilters,
										}}
										resetOptions={{
											icon: <Icon className="u-font-size-22" name={IconNamesLight.Redo} />,
											label: tText('modules/account/views/account-my-material-requests___reset'),
											variants: ['text'],
											onClick: setSelectedDownloadFilters,
										}}
									/>
								</div>

								<SearchBar
									id="materiaalaanvragen-searchbar"
									value={search}
									className="p-material-requests__searchbar"
									placeholder={tText('modules/account/views/account-my-material-requests___zoek')}
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
					)}

					{isFetching && <Loading owner="Material requests overview" />}
					{noData && !isFetching && renderEmptyMessage()}
					{renderContent()}
					{renderDetailBlade()}
				</div>
			</AccountLayout>
		);
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={tText('pages/account/mijn-profiel/index___mijn-materiaalaanvragen')}
				description={tText(
					'pages/account/mijn-profiel/index___mijn-materiaalaanvragen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};
