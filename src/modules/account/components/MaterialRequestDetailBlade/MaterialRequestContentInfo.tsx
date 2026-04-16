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
	type MaterialRequestMessageBodyStatusUpdateWithMotivation,
} from '@material-requests/types';
import { AdminConfigManager } from '@meemoo/admin-core-ui/admin';
import { AudioOrVideoPlayer } from '@shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer';
import { tText } from '@shared/helpers/translate';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatLongDate, formatMediumDateWithTime } from '@shared/utils/dates';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { noop } from 'lodash-es';
import React, { type FC, type ReactNode, useState } from 'react';
import styles from './MaterialRequestContentInfo.module.scss';

interface MaterialRequestContentInfoProps {
	currentMaterialRequestDetail: MaterialRequest;
}

const MaterialRequestContentInfo: FC<MaterialRequestContentInfoProps> = ({
	currentMaterialRequestDetail,
}) => {
	const { isObjectEssenceAccessibleToUser } = useIsComplexReuseFlow(currentMaterialRequestDetail);

	const [isMediaPaused, setIsMediaPaused] = useState(true);

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
				className={styles['p-material-request-detail__content-info__content-block']}
			>
				{title && (
					<dt className={styles['p-material-request-detail__content-info__content-block-title']}>
						{title}
					</dt>
				)}
				<dd>
					{subtitle && (
						<div
							className={styles['p-material-request-detail__content-info__content-block-subtitle']}
						>
							{subtitle}
						</div>
					)}
					{content && (
						<div className={styles['p-material-request-detail__content-info__content-block-value']}>
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
			<dl className={styles['p-material-request-detail__content-info__content-block']}>
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
						className={styles['p-material-request-detail__content-info__content-block-value']}
					>
						{date}
					</dd>
				))}
			</dl>
		);
	};

	const renderHistory = () => {
		const formatEventDate = (date: string): string => formatMediumDateWithTime(asDate(date));

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
				case MaterialRequestEventType.ADDITIONAL_CONDITIONS_DENIED:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___geannulleerd-op',
						{
							cancelledAt: formatEventDate(item.createdAt),
						}
					);
				case MaterialRequestEventType.DOWNLOAD_AVAILABLE:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-beschikbaar-van-tot',
						{
							availableAt: formatEventDate(item.createdAt),
							expiresAt: formatEventDate(currentMaterialRequestDetail.downloadExpiresAt as string),
						}
					);
				case MaterialRequestEventType.ADDITIONAL_CONDITIONS:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___voorwaarden-verstuurd-op',
						{
							sentAt: formatEventDate(item.createdAt),
						}
					);
				case MaterialRequestEventType.ADDITIONAL_CONDITIONS_ACCEPTED:
					return tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___voorwaarden-aanvaard-op',
						{
							sentAt: formatEventDate(item.createdAt),
						}
					);
				default:
					// Others will not be rendered
					return '';
			}
		};

		return renderContentBlock(
			tText(
				'modules/account/components/material-request-detail-blade/material-request-content-info___geschiedenis'
			),
			[
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___aangevraagd-op',
					{
						requestedAt: formatEventDate(
							currentMaterialRequestDetail.requestedAt || currentMaterialRequestDetail.createdAt
						),
					}
				),
				...currentMaterialRequestDetail.history.map(mapEvent),
			]
				.filter((item) => !!item)
				.map((date) => <div key={`material-request-status-date-${date}`}>{date}</div>)
		);
	};

	const renderMotivation = () => {
		let event: MaterialRequestEvent | undefined;

		const renderAdditionConditions = (_event: MaterialRequestEvent) => {
			// TODO: render additional condition
			return renderContentBlock(
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___motivatie'
				),
				'TODO: render additional condition'
			);
		};

		const doRenderMotivation = (event: MaterialRequestEvent) => {
			const motivation = (event.body as MaterialRequestMessageBodyStatusUpdateWithMotivation)
				?.motivation;

			if (!motivation) {
				return null;
			}
			return renderContentBlock(
				tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___motivatie'
				),
				motivation
			);
		};

		event = currentMaterialRequestDetail.history.find(
			(item) => item.messageType === MaterialRequestEventType.DENIED
		);
		if (event) {
			return doRenderMotivation(event);
		}

		event = currentMaterialRequestDetail.history.find(
			(item) => item.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS_ACCEPTED
		);
		if (event) {
			return renderAdditionConditions(event);
		}

		event = currentMaterialRequestDetail.history.find(
			(item) => item.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS_DENIED
		);
		if (event) {
			return renderAdditionConditions(event);
		}

		event = currentMaterialRequestDetail.history.find(
			(item) => item.messageType === MaterialRequestEventType.APPROVED
		);
		if (event) {
			return doRenderMotivation(event);
		}
	};

	const renderThumbnail = () => {
		if (!currentMaterialRequestDetail.reuseForm) {
			return null;
		}

		let { objectThumbnailUrl, objectDctermsFormat, objectRepresentation, reuseForm } =
			currentMaterialRequestDetail;

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
			<AudioOrVideoPlayer
				className={styles['p-material-request-detail__content-info__content-block-media']}
				locationId="Material request detail blade"
				representation={objectRepresentation}
				dctermsFormat={objectDctermsFormat}
				cuePoints={
					reuseForm?.endTime
						? { start: reuseForm.startTime as number, end: reuseForm.endTime as number }
						: undefined
				}
				maintainerLogo={currentMaterialRequestDetail.maintainerLogo ?? undefined}
				poster={objectThumbnailUrl}
				paused={isMediaPaused}
				onPlay={() => setIsMediaPaused(false)}
				onPause={() => setIsMediaPaused(true)}
				onMediaReady={noop}
			/>
		);
	};
	const renderGeneralInformation = () => {
		return (
			<div className={styles['p-material-request-detail__content-info__general-information']}>
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
					tText(
						'modules/account/components/material-request-detail-blade/material-request-content-info___type-aanvraag'
					),
					tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraag-tot',
						{
							requestType:
								GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[currentMaterialRequestDetail.type],
						}
					)
				)}
			</div>
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
			<div className={styles['p-material-request-detail__content-info__reuse-form']}>
				{renderThumbnail()}
				{materialRequestEntries.map(({ label, value }) => renderContentBlock(label, value))}
			</div>
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
		<div className={styles['p-material-request-detail__content-info']}>
			{renderReuseForm()}
			{renderGeneralInformation()}
		</div>
	);
};

export default MaterialRequestContentInfo;
