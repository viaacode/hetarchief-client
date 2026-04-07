import { isMaterialRequestClosed } from '@account/utils/is-material-request-closed';
import { useGetMaterialRequestAttachments } from '@material-requests/hooks/get-material-request-attachments';
import type { MaterialRequest, MaterialRequestAttachment } from '@material-requests/types';
import { Button, PaginationBar, Table } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import { sortingIcons } from '@shared/components/Table';
import { tText } from '@shared/helpers/translate';
import { asDate, formatMediumDateWithTime } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import clsx from 'clsx';
import getConfig from 'next/config';
import Link from 'next/link';
import React, { type FC, useMemo, useState } from 'react';
import type {
	Column,
	ColumnInstance,
	HeaderGroup,
	SortingRule,
	TableCellProps,
	TableHeaderProps,
	TableState,
} from 'react-table';
import styles from './MaterialRequestDocuments.module.scss';

interface MaterialRequestDocumentsProps {
	materialRequest: MaterialRequest;
}

const MATERIAL_REQUEST_DOCUMENTS_PAGE_SIZE = 20;

const MaterialRequestDocuments: FC<MaterialRequestDocumentsProps> = ({ materialRequest }) => {
	const { publicRuntimeConfig } = getConfig();
	const [orderProp, setOrderProp] = useState<string>('createdAt');
	const [orderDirection, setOrderDirection] = useState<AvoSearchOrderDirection>(
		AvoSearchOrderDirection.ASC
	);
	const [page, setPage] = useState<number>(1);

	const {
		data: attachments,
		isLoading,
		isFetching,
		isError,
	} = useGetMaterialRequestAttachments(
		materialRequest.id,
		orderProp,
		orderDirection,
		page,
		MATERIAL_REQUEST_DOCUMENTS_PAGE_SIZE
	);

	const columns: Column<MaterialRequestAttachment>[] = [
		{
			Header: tText(
				'modules/account/components/material-request-detail-blade/material-request-documents___naam-document'
			),
			accessor: 'attachmentFilename',
			disableSortBy: true,
			Cell: ({ row: { original } }) => (
				<Link
					className={clsx(
						styles['p-material-request-detail__documents__table-cell'],
						styles['p-material-request-detail__documents__table-cell-document']
					)}
					href={original.attachmentUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`${original.attachmentFilename} ${tText('modules/account/components/material-request-detail-blade/material-request-documents___opent-in-nieuw-venster')}`}
				>
					{original.attachmentFilename}
				</Link>
			),
		} as Column<MaterialRequestAttachment>,
		{
			Header: tText(
				'modules/account/components/material-request-detail-blade/material-request-documents___datum'
			),
			accessor: 'createdAt',
			Cell: ({ row: { original } }) => {
				const date = formatMediumDateWithTime(asDate(original.createdAt));
				return (
					<span
						className={clsx(
							styles['p-material-request-detail__documents__table-cell'],
							styles['p-material-request-detail__documents__table-cell-date']
						)}
						title={date}
					>
						{date}
					</span>
				);
			},
		} as Column<MaterialRequestAttachment>,
	];

	const sortFilters = useMemo(
		(): SortingRule<{ id: string; desc: boolean }>[] => [
			{
				id: orderProp,
				desc: orderDirection !== AvoSearchOrderDirection.ASC,
			},
		],
		[orderProp, orderDirection]
	);

	const onSortChange = (
		newOrderProp: string | undefined,
		newOrderDirection: AvoSearchOrderDirection | undefined
	): void => {
		console.log(newOrderProp, orderProp, newOrderDirection, orderDirection);
		if (newOrderProp !== orderProp || newOrderDirection !== orderDirection) {
			setOrderProp(newOrderProp || 'createdAt');
			setOrderDirection(newOrderDirection || AvoSearchOrderDirection.DESC);
		}
	};

	const getTableColumnProps = (
		column: HeaderGroup<MaterialRequestAttachment> | ColumnInstance<MaterialRequestAttachment>
	): Partial<TableHeaderProps> | Partial<TableCellProps> => {
		if (column.id === 'createdAt') {
			const columnWidth = '17rem';
			return {
				style: {
					width: columnWidth,
					minWidth: columnWidth,
					maxWidth: columnWidth,
				},
			};
		}

		return {};
	};

	const renderDownloadAllButton = () => {
		if (!isMaterialRequestClosed(materialRequest)) {
			return null;
		}
		return (
			<Link
				passHref
				href={`${publicRuntimeConfig.PROXY_URL}/material-request-messages/${materialRequest.id}/attachments/download-zip`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={tText(
					'modules/account/components/material-request-detail-blade/material-request-documents___download-alles'
				)}
			>
				<Button
					label={tText(
						'modules/account/components/material-request-detail-blade/material-request-documents___download-alles',
						{
							numberOfAttachments: attachments?.total,
						}
					)}
					variants="outline"
					iconStart={<Icon name={IconNamesLight.Download} aria-hidden="true" />}
					tabIndex={-1}
				/>
			</Link>
		);
	};

	const renderContent = () => {
		if (isLoading || isFetching) {
			return <Loading fullscreen={false} locationId="material-request-detail-blade-documents" />;
		}

		if (isError) {
			return tText(
				'modules/account/components/material-request-detail-blade/material-request-documents___fout-bij-laden'
			);
		}

		if (!attachments?.items || attachments.items.length === 0) {
			return tText(
				'modules/account/components/material-request-detail-blade/material-request-documents___geen-documenten'
			);
		}

		return (
			<>
				<Table<MaterialRequestAttachment>
					className={clsx(styles['p-material-request-detail__documents__table'])}
					getColumnProps={getTableColumnProps}
					options={{
						columns,
						data: attachments.items,
						initialState: {
							sortBy: sortFilters,
							pageSize: MATERIAL_REQUEST_DOCUMENTS_PAGE_SIZE,
						} as TableState<MaterialRequestAttachment>,
					}}
					sortingIcons={sortingIcons}
					onSortChange={onSortChange}
					showTable={true}
					enableRowFocusOnClick={true}
					pagination={({ gotoPage }) => (
						<PaginationBar
							showFirstAndLastButtons
							{...getDefaultPaginationBarProps()}
							startItem={Math.max(0, page - 1) * MATERIAL_REQUEST_DOCUMENTS_PAGE_SIZE}
							totalItems={attachments?.total || 0}
							itemsPerPage={MATERIAL_REQUEST_DOCUMENTS_PAGE_SIZE}
							onPageChange={(pageZeroBased: number) => {
								gotoPage(pageZeroBased);
								setPage(pageZeroBased + 1);
							}}
						/>
					)}
				/>
				{renderDownloadAllButton()}
			</>
		);
	};

	return (
		<div
			className={clsx(
				styles['p-material-request-detail__documents'],
				(isLoading || isFetching || isError || !attachments?.items.length) &&
					styles['p-material-request-detail__documents--centered']
			)}
		>
			{renderContent()}
		</div>
	);
};

export default MaterialRequestDocuments;
