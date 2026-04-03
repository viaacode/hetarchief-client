import { useGetMaterialRequestAttachments } from '@material-requests/hooks/get-material-request-attachments';
import type { MaterialRequestAttachment } from '@material-requests/types';
import { Button, PaginationBar, Table } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import { sortingIcons } from '@shared/components/Table';
import { tText } from '@shared/helpers/translate';
import { asDate, formatMediumDateWithTime } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import getConfig from 'next/config';
import Link from 'next/link';
import React, { type FC, useMemo, useState } from 'react';
import type { Column, SortingRule, TableState } from 'react-table';
import styles from './MaterialRequestDetailBlade.module.scss';

interface MaterialRequestDocumentsProps {
	materialRequestId: string;
}

const MATERIAL_REQUEST_DOCUMENTS_PAGE_SIZE = 20;

const MaterialRequestDocuments: FC<MaterialRequestDocumentsProps> = ({ materialRequestId }) => {
	const { publicRuntimeConfig } = getConfig();
	const [orderProp, setOrderProp] = useState<string>('createdAt');
	const [orderDirection, setOrderDirection] = useState<AvoSearchOrderDirection>(
		AvoSearchOrderDirection.ASC
	);
	const [page, setPage] = useState<number>(1);

	const {
		data: attachments,
		isLoading,
		isError,
	} = useGetMaterialRequestAttachments(
		materialRequestId,
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
				<a
					href={original.attachmentUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`${original.attachmentFilename} ${tText('modules/account/components/material-request-detail-blade/material-request-documents___opent-in-nieuw-venster')}`}
				>
					{original.attachmentFilename}
				</a>
			),
		} as Column<MaterialRequestAttachment>,
		{
			Header: tText(
				'modules/account/components/material-request-detail-blade/material-request-documents___datum'
			),
			accessor: 'createdAt',
			Cell: ({ row: { original } }) => {
				const date = formatMediumDateWithTime(asDate(original.createdAt));
				return <span title={date}>{date}</span>;
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
		if (newOrderProp !== orderProp || newOrderDirection !== orderDirection) {
			setOrderProp(newOrderProp || 'createdAt');
			setOrderDirection(newOrderDirection || AvoSearchOrderDirection.DESC);
		}
	};

	if (isLoading) {
		return (
			<div className={styles['p-material-request-detail__content']}>
				<Loading fullscreen={false} locationId="material-request-documents" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className={styles['p-material-request-detail__content']}>
				<p>
					{tText(
						'modules/account/components/material-request-detail-blade/material-request-documents___fout-bij-laden'
					)}
				</p>
			</div>
		);
	}

	if (!attachments?.items || attachments.items.length === 0) {
		return (
			<div className={styles['p-material-request-detail__content']}>
				<p>
					{tText(
						'modules/account/components/material-request-detail-blade/material-request-documents___geen-documenten'
					)}
				</p>
			</div>
		);
	}

	return (
		<>
			<Table<MaterialRequestAttachment>
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
			<Link
				passHref
				href={`${publicRuntimeConfig.PROXY_URL}/material-request-messages/${materialRequestId}/attachments/download-zip`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={tText(
					'modules/account/components/material-request-detail-blade/material-request-documents___download-alles'
				)}
			>
				<Button
					className="u-mt-16"
					label={
						tText(
							'modules/account/components/material-request-detail-blade/material-request-documents___download-alles'
						) + ` (${attachments.total})`
					}
					variants="outline"
					iconStart={
						<Icon className="u-text-left" name={IconNamesLight.Download} aria-hidden="true" />
					}
					tabIndex={-1}
				/>
			</Link>
		</>
	);
};

export default MaterialRequestDocuments;
