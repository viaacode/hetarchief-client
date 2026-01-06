import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD,
	type MaterialRequestDetail,
	MaterialRequestStatus,
} from '@material-requests/types';
import { Button } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { asDate, formatLongDate } from '@shared/utils/dates';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import clsx from 'clsx';
import React, { type FC, type ReactNode } from 'react';

import styles from './MaterialRequestDetailBlade.module.scss';

interface MaterialRequestDetailBladeProps {
	isOpen: boolean;
	onClose: () => void;
	currentMaterialRequestDetail: MaterialRequestDetail;
}

const MaterialRequestDetailBlade: FC<MaterialRequestDetailBladeProps> = ({
	isOpen,
	onClose,
	currentMaterialRequestDetail,
}) => {
	const locale = useLocale();

	const renderFooter = () => {
		return (
			<div className={styles['p-account-my-material-requests__close-button-container']}>
				<Button
					label={tText(
						'modules/account/components/material-request-detail-blade/material-requests___sluit'
					)}
					variants={['block', 'text']}
					onClick={onClose}
					className={styles['p-account-my-material-requests__close-button']}
				/>
			</div>
		);
	};

	const renderContentBlock = (
		title: string,
		subtitle: ReactNode | undefined,
		content: ReactNode | undefined
	) => {
		if (!subtitle && !content) {
			return null;
		}

		return (
			<dl className={styles['p-account-my-material-requests__content-block']}>
				{title && (
					<dt className={styles['p-account-my-material-requests__content-block-title']}>{title}</dt>
				)}
				<dd>
					{subtitle && (
						<div className={styles['p-account-my-material-requests__content-block-subtitle']}>
							{subtitle}
						</div>
					)}
					{content && (
						<div className={styles['p-account-my-material-requests__content-block-value']}>
							{content}
						</div>
					)}
				</dd>
			</dl>
		);
	};

	const renderDownload = () => {
		if (currentMaterialRequestDetail.status !== MaterialRequestStatus.APPROVED) {
			return null;
		}

		// TODO: take into account if the download url has expired and ots date
		const hasDownloadExpired = false;
		const downloadExpirationDate =
			currentMaterialRequestDetail.downloadUrl &&
			formatLongDate(asDate(currentMaterialRequestDetail.createdAt));

		return (
			<>
				{!hasDownloadExpired && (
					<Button
						className="u-mt-16"
						label={
							currentMaterialRequestDetail.downloadUrl
								? tText('Downlooad materiaal')
								: tText('Download in voorbereiding')
						}
						disabled={!currentMaterialRequestDetail.downloadUrl}
						variants={['block']}
						onClick={() => window.open(currentMaterialRequestDetail.downloadUrl as string)}
					/>
				)}

				{downloadExpirationDate && (
					<span
						className={clsx(
							styles['p-account-my-material-requests__content-block-value'],
							'u-flex',
							'u-align-center',
							'u-flex-row',
							'u-pt-12'
						)}
					>
						<Icon name={IconNamesLight.Exclamation} className="u-mr-4" />
						{hasDownloadExpired
							? tText('Download is verlopen op', { downloadExpirationDate })
							: tText('Download is beschikbaar tot en met', { downloadExpirationDate })}
					</span>
				)}
			</>
		);
	};

	const renderRequestStatus = () => {
		const formattedStatusDates = [
			tText('Aangevraagd op', {
				requestedAt: formatLongDate(
					asDate(currentMaterialRequestDetail.requestedAt || currentMaterialRequestDetail.createdAt)
				),
			}),
			...(currentMaterialRequestDetail.approvedAt
				? [
						tText('Goedgekeurd op', {
							approvedAt: formatLongDate(asDate(currentMaterialRequestDetail.approvedAt)),
						}),
					]
				: []),
			...(currentMaterialRequestDetail.deniedAt
				? [
						tText('Geweigerd op', {
							deniedAt: formatLongDate(asDate(currentMaterialRequestDetail.deniedAt)),
						}),
					]
				: []),
			...(currentMaterialRequestDetail.cancelledAt
				? [
						tText('Geannulleerd op', {
							cancelledAt: formatLongDate(asDate(currentMaterialRequestDetail.cancelledAt)),
						}),
					]
				: []),
		];

		return (
			<dl className={styles['p-account-my-material-requests__content-block']}>
				<dt
					className={clsx(
						'u-font-size-14',
						'u-flex',
						'u-flex-row',
						'u-align-center',
						'u-justify-between'
					)}
				>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraag-tot',
						{
							requestType:
								GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[currentMaterialRequestDetail.type],
						}
					)}
					<MaterialRequestStatusPill status={currentMaterialRequestDetail.status} showLabel />
				</dt>
				{formattedStatusDates.map((date) => (
					<dd
						key={`material-request-status-date-${date}`}
						className={styles['p-account-my-material-requests__content-block-value']}
					>
						{date}
					</dd>
				))}
				<dd>{renderDownload()}</dd>
			</dl>
		);
	};

	const renderReuseForm = () => {
		if (!currentMaterialRequestDetail.reuseForm) {
			return;
		}

		const { objectThumbnailUrl, reuseForm } = currentMaterialRequestDetail;

		return (
			<>
				{objectThumbnailUrl &&
					renderContentBlock(
						tText('Fragment resolutie'),
						<div
							className={styles['p-object-detail__media']}
							style={{ backgroundImage: `url(${objectThumbnailUrl})` }}
						></div>,
						undefined
					)}
			</>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<>
					<h2
						{...props}
						className={clsx(props.className, styles['p-account-my-material-requests__title'])}
					>
						{tText(
							'modules/account/components/material-request-detail-blade/material-requests___detail'
						)}
					</h2>
					<MaterialRequestInformation />
				</>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
			id="material-request-detail-blade"
		>
			<div className={styles['p-account-my-material-requests__content-wrapper']}>
				<div className={styles['p-account-my-material-requests__content']}>
					<MaterialCard
						objectId={currentMaterialRequestDetail.objectSchemaIdentifier}
						title={currentMaterialRequestDetail.objectSchemaName}
						thumbnail={currentMaterialRequestDetail.objectThumbnailUrl}
						hideThumbnail={true}
						orientation="vertical"
						link={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${currentMaterialRequestDetail.maintainerSlug}/${currentMaterialRequestDetail.objectSchemaIdentifier}`}
						type={currentMaterialRequestDetail.objectDctermsFormat}
						publishedBy={currentMaterialRequestDetail.maintainerName}
						publishedOrCreatedDate={currentMaterialRequestDetail.objectPublishedOrCreatedDate}
						icon={getIconFromObjectType(
							currentMaterialRequestDetail.objectDctermsFormat,
							!!currentMaterialRequestDetail.objectRepresentationId
						)}
					/>
				</div>

				<div className={styles['p-account-my-material-requests__content']}>
					{renderRequestStatus()}

					{renderContentBlock(
						tText('Naam aanvraag'),
						undefined,
						currentMaterialRequestDetail.requestName
					)}
					{renderContentBlock(
						tText('Aanvrager'),
						currentMaterialRequestDetail.requesterFullName,
						currentMaterialRequestDetail.requesterMail
					)}
					{renderContentBlock(
						tText('Aanvragende organisatie'),
						currentMaterialRequestDetail.organisation,
						undefined
					)}

					{/** TODO: CHeck if the requester is a key user, in that case do not show this. Otherwise do show this */}
					{!currentMaterialRequestDetail.reuseForm &&
						currentMaterialRequestDetail.requesterCapacity &&
						renderContentBlock(
							tText(
								'modules/account/components/material-request-detail-blade/material-requests___hoedanigheid'
							),
							undefined,
							GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD()[
								currentMaterialRequestDetail.requesterCapacity
							]
						)}

					{renderReuseForm()}
				</div>
			</div>
		</Blade>
	);
};

export default MaterialRequestDetailBlade;
