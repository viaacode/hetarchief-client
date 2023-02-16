import { OrderDirection, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, ReactNode, useMemo } from 'react';
import { SortingRule, TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import {
	ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG,
	ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE,
	getAccountMaterialRequestTableColumns,
	Permission,
} from '@account/const';
import { AccountLayout } from '@account/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { Loading, PaginationBar, sortingIcons } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import { useGetMaterialRequests } from '@material-requests/hooks/get-material-requests';
import { MaterialRequest, MaterialRequestKeys } from '@material-requests/types';
import { VisitorLayout } from 'modules/visitors';

const AccountMyMaterialRequests: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG);
	const { data: materialRequests, isFetching } = useGetMaterialRequests({
		isPersonal: true,
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
			start={Math.max(0, filters.page - 1) * ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			total={materialRequests?.total || 0}
			count={ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE}
			onPageChange={(pageZeroBased: number) => onPageChange(pageZeroBased, gotoPage)}
		/>
	);

	const renderEmptyMessage = (): ReactNode =>
		tHtml('pages/account/mijn-profiel/index___geen-materiaal-aanvragen');

	const renderContent = (): ReactNode => {
		return (
			<Table<MaterialRequest>
				className="u-mt-24 p-material-requests__table"
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
			/>
		);
	};

	const renderPageContent = () => {
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
					{isFetching && <Loading owner="Material requests overview" />}
					{noData && renderEmptyMessage()}
					{!noData && !isFetching && renderContent()}
				</div>
			</AccountLayout>
		);
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				tText('pages/account/mijn-profiel/index___mijn-materiaalaanvragen'),
				tText(
					'pages/account/mijn-profiel/index___mijn-materiaalaanvragen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AccountMyMaterialRequests as ComponentType);
