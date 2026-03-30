import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import { createLabelValuePairMaterialRequestReuseForm } from '@account/utils/create-label-value-material-request-reuse-form';
import { formatCuePointsMaterialRequest } from '@account/utils/format-cuepoints-material-request';
import {
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE,
} from '@material-requests/const';
import {
	GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD,
	type MaterialRequest,
	type MaterialRequestDownloadQuality,
	type MaterialRequestEvent,
	MaterialRequestEventType,
} from '@material-requests/types';
import { AdminConfigManager } from '@meemoo/admin-core-ui/admin';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { CUE_POINTS_SEPARATOR, QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { buildLink } from '@shared/helpers/build-link';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatLongDate } from '@shared/utils/dates';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { default as NextLink } from 'next/link';
import React, { type FC, type ReactNode, useMemo } from 'react';
import styles from './MaterialRequestContentInfo.module.scss';

interface MaterialRequestContentInfoProps {
	currentMaterialRequestDetail: MaterialRequest;
}

const MaterialRequestContentInfo: FC<MaterialRequestContentInfoProps> = ({
	currentMaterialRequestDetail,
}) => {
	const locale = useLocale();
	const { isObjectEssenceAccessibleToUser } = useIsComplexReuseFlow(currentMaterialRequestDetail);

	const itemLink = useMemo(
		() =>
			buildLink(
				ROUTES_BY_LOCALE[locale].detailPage,
				{
					maintainerSlug: currentMaterialRequestDetail.maintainerSlug,
					pid: currentMaterialRequestDetail.objectSchemaIdentifier,
				},
				isNil(currentMaterialRequestDetail.reuseForm?.endTime)
					? {}
					: {
							[QUERY_PARAM_KEY.CUE_POINTS]: [
								currentMaterialRequestDetail.reuseForm?.startTime,
								currentMaterialRequestDetail.reuseForm?.endTime,
							].join(CUE_POINTS_SEPARATOR),
						}
			),
		[currentMaterialRequestDetail, locale]
	);

	const renderContentBlock = (
		title: string,
		content: ReactNode | undefined,
		subtitle?: ReactNode
	) => {
		if (!subtitle && !content) {
			return null;
		}

		return (
			<dl
				key={`material-request-content-block-${title}`}
				className={styles['p-material-request-detail__content-block']}
			>
				{title && (
					<dt className={styles['p-material-request-detail__content-block-title']}>{title}</dt>
				)}
				<dd>
					{subtitle && (
						<div className={styles['p-material-request-detail__content-block-subtitle']}>
							{subtitle}
						</div>
					)}
					{content && (
						<div className={styles['p-material-request-detail__content-block-value']}>
							{content}
						</div>
					)}
				</dd>
			</dl>
		);
	};

	const renderRequestStatus = () => {
		const formattedStatusDates = [
			tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___aangevraagd-op',
				{
					requestedAt: formatLongDate(
						asDate(
							currentMaterialRequestDetail.requestedAt || currentMaterialRequestDetail.createdAt
						)
					),
				}
			),
		];

		return (
			<dl className={styles['p-material-request-detail__content-block']}>
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
						className={styles['p-material-request-detail__content-block-value']}
					>
						{date}
					</dd>
				))}
			</dl>
		);
	};

	const renderHistory = () => {
		const formatEventDate = (date: string): string => formatLongDate(asDate(date));

		const mapEvent = (item: MaterialRequestEvent): string => {
			switch (item.messageType) {
				case MaterialRequestEventType.APPROVED:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___goedgekeurd-op',
						{
							approvedAt: formatEventDate(item.createdAt),
						}
					);
				case MaterialRequestEventType.DENIED:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___geweigerd-op',
						{
							deniedAt: formatEventDate(item.createdAt),
						}
					);
				case MaterialRequestEventType.CANCELLED:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___geannulleerd-op',
						{
							cancelledAt: formatEventDate(item.createdAt),
						}
					);
				// TODO: add missing cases
				default:
					return formatEventDate(item.createdAt);
			}
		};

		return renderContentBlock(
			tText('Geschiedenis'),
			[
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___aangevraagd-op',
					{
						requestedAt: formatLongDate(
							asDate(
								currentMaterialRequestDetail.requestedAt || currentMaterialRequestDetail.createdAt
							)
						),
					}
				),
				...currentMaterialRequestDetail.history.map(mapEvent),
			].map((date) => <div key={`material-request-status-date-${date}`}>{date}</div>)
		);
	};

	const renderMotivation = () => {
		// TODO: render motivation
		return null;
	};

	const renderThumbnail = () => {
		if (!currentMaterialRequestDetail.reuseForm) {
			return null;
		}

		let { objectThumbnailUrl, objectDctermsFormat, reuseForm } = currentMaterialRequestDetail;

		if (
			objectDctermsFormat === IeObjectType.AUDIO ||
			objectDctermsFormat === IeObjectType.AUDIO_FRAGMENT
		) {
			objectThumbnailUrl = AdminConfigManager.getConfig().components.defaultAudioStill;
		}

		if (!objectThumbnailUrl || !isObjectEssenceAccessibleToUser) {
			return null;
		}

		return renderContentBlock(
			tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___fragment-resolutie'
			),
			<>
				{formatCuePointsMaterialRequest(reuseForm)}
				<br />
				{
					GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY()[
						reuseForm.downloadQuality as MaterialRequestDownloadQuality
					]
				}
			</>,
			<NextLink passHref href={itemLink} style={{ textDecoration: 'none' }} target="_blank">
				{/** biome-ignore lint/performance/noImgElement: Thumbnail is needed here */}
				<img
					className={styles['p-material-request-detail__content-block-media']}
					src={objectThumbnailUrl}
					aria-hidden
					alt={tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___alt-text-of-the-thumbnail-of-the-material-thats-being-requested'
					)}
				/>
			</NextLink>
		);
	};

	const renderReuseForm = () => {
		if (!currentMaterialRequestDetail.reuseForm) {
			return;
		}

		const materialRequestEntries = createLabelValuePairMaterialRequestReuseForm(
			currentMaterialRequestDetail.reuseForm
		);

		return (
			<>
				{renderThumbnail()}
				{materialRequestEntries.map(({ label, value }) => renderContentBlock(label, value))}
			</>
		);
	};

	// No tabs to show, so always render all content in the blade
	if (!currentMaterialRequestDetail.reuseForm) {
		return (
			<>
				{renderRequestStatus()}
				{renderContentBlock(
					tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___naam-aanvraag'
					),
					currentMaterialRequestDetail.requestGroupName
				)}
				{renderContentBlock(
					tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvrager'
					),
					currentMaterialRequestDetail.requesterMail,
					currentMaterialRequestDetail.requesterFullName
				)}
				{renderContentBlock(
					tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvragende-organisatie'
					),
					currentMaterialRequestDetail.requesterOrganisationSector,
					currentMaterialRequestDetail.requesterOrganisation
				)}
				{renderContentBlock(
					tText(
						'modules/account/components/material-request-detail-blade/material-requests___reden'
					),
					currentMaterialRequestDetail.reason || '-'
				)}

				{currentMaterialRequestDetail.requesterCapacity &&
					renderContentBlock(
						tText(
							'modules/account/components/material-request-detail-blade/material-requests___hoedanigheid'
						),
						GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD()[
							currentMaterialRequestDetail.requesterCapacity
						]
					)}
			</>
		);
	}

	return (
		<>
			{renderHistory()}
			{renderContentBlock(
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvrager'
				),
				currentMaterialRequestDetail.requesterMail,
				currentMaterialRequestDetail.requesterFullName
			)}
			{renderContentBlock(
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvragende-organisatie'
				),
				currentMaterialRequestDetail.requesterOrganisationSector,
				currentMaterialRequestDetail.requesterOrganisation
			)}
			{renderContentBlock(
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___naam-aanvraag'
				),
				currentMaterialRequestDetail.requestGroupName
			)}
			{renderMotivation()}
			{renderContentBlock(
				tText('Type aanvraag'),
				tText(
					'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraag-tot',
					{
						requestType:
							GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[currentMaterialRequestDetail.type],
					}
				)
			)}
			{renderReuseForm()}
		</>
	);
};

export default MaterialRequestContentInfo;
