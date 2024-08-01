import { OrderDirection, type Row, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import { type FC, type MouseEvent, type ReactNode, useMemo, useState } from 'react';
import { type SortingRule, type TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import MaterialRequestDetailBlade from '@account/components/MaterialRequestDetailBlade/MaterialRequestDetailBlade';
import {
	ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	getAccountMaterialRequestTableColumns,
	Permission,
} from '@account/const';
import { AccountLayout } from '@account/layouts';
import { useGetMaterialRequestById } from '@material-requests/hooks/get-material-request-by-id';
import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { type MaterialRequest, MaterialRequestKeys } from '@material-requests/types';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Loading } from '@shared/components/Loading';
import { PaginationBar } from '@shared/components/PaginationBar';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { VisitorLayout } from '@visitor-layout/index';

export const AccountMyMaterialRequests: FC<DefaultSeoInfo> = ({ url }) => {
	const [filters, setFilters] = useQueryParams(ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const [isDetailBladeOpen, setIsDetailBladeOpen] = useState(false);
	const [currentMaterialRequest, setCurrentMaterialRequest] = useState<MaterialRequest>();

	const hasMaterialRequestsPerm = useHasAnyPermission(Permission.VIEW_OWN_MATERIAL_REQUESTS);

	const { data: currentMaterialRequestDetail, isFetching: isLoading } = useGetMaterialRequestById(
		currentMaterialRequest?.id || null
	);
	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		isPersonal: true,
		isPending: false,
		size: ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
		...(!isNil(filters.page) && { page: filters.page }),
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

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	): void => {
		if (filters.orderProp === MaterialRequestKeys.updatedAt && orderDirection === undefined) {
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
			start={Math.max(0, filters.page - 1) * ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/account/mijn-profiel/index___geen-materiaal-aanvragen');

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
				className="u-mt-24 p-material-requests__table p-account-my-material-requests__table"
				options={{
					columns: getAccountMaterialRequestTableColumns(),
					data: materialRequests?.items || [],
					initialState: {
						pageSize: ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
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
		if (!hasMaterialRequestsPerm) {
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
			<AccountLayout
				className="p-account-my-material-requests"
				pageTitle={tText('pages/account/mijn-profiel/index___mijn-materiaalaanvragen')}
			>
				<div
					className={clsx('l-container l-container--edgeless-to-lg', {
						'u-text-center u-color-neutral u-py-48': isFetching || noData,
					})}
				>
					{isFetching && <Loading owner="Material requests overview" fullscreen />}
					{noData && renderEmptyMessage()}
					{!noData && !isFetching && renderContent()}
					{currentMaterialRequest?.id && renderDetailBlade()}
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
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};
