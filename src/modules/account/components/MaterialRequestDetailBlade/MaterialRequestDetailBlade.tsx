import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import { createLabelValuePairMaterialRequestReuseForm } from '@account/utils/create-label-value-material-request-reuse-form';
import { formatCuePointsMaterialRequest } from '@account/utils/format-cuepoints-material-request';
import {
	determineHasDownloadExpired,
	handleDownloadMaterialRequest,
} from '@account/utils/handle-download-material-request';
import { selectUser } from '@auth/store/user';
import {
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE,
} from '@material-requests/const';
import { MaterialRequestsService } from '@material-requests/services';
import {
	GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD,
	type MaterialRequestDetail,
	type MaterialRequestDownloadQuality,
	MaterialRequestStatus,
} from '@material-requests/types';
import { Button } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { CUE_POINTS_SEPARATOR, QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { asDate, formatLongDate } from '@shared/utils/dates';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { default as NextLink } from 'next/link';
import { stringifyUrl } from 'query-string';
import React, { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './MaterialRequestDetailBlade.module.scss';

interface MaterialRequestDetailBladeProps {
	isOpen: boolean;
	onClose: () => void;
	allowRequestCancellation: boolean;
	onApproveRequest?: () => void;
	onDeclineRequest?: () => void;
	currentMaterialRequestDetail: MaterialRequestDetail;
	afterStatusChanged: () => void;
	layer?: number;
	currentLayer?: number;
}

const MaterialRequestDetailBlade: FC<MaterialRequestDetailBladeProps> = ({
	isOpen,
	onClose,
	allowRequestCancellation,
	currentMaterialRequestDetail,
	onApproveRequest,
	onDeclineRequest,
	afterStatusChanged,
	layer,
	currentLayer,
}) => {
	const locale = useLocale();
	const user = useSelector(selectUser);

	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const canRequestBeEvaluated = useMemo(
		() =>
			currentMaterialRequestDetail.status === MaterialRequestStatus.PENDING && user?.isEvaluator,
		[currentMaterialRequestDetail.status, user?.isEvaluator]
	);
	const itemLink = useMemo(
		() =>
			stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${currentMaterialRequestDetail.maintainerSlug}/${currentMaterialRequestDetail.objectSchemaIdentifier}`,
				query: isNil(currentMaterialRequestDetail.reuseForm?.endTime)
					? {}
					: {
							[QUERY_PARAM_KEY.CUE_POINTS]: [
								currentMaterialRequestDetail.reuseForm?.startTime,
								currentMaterialRequestDetail.reuseForm?.endTime,
							].join(CUE_POINTS_SEPARATOR),
						},
			}),
		[currentMaterialRequestDetail, locale]
	);

	useEffect(() => {
		if (currentMaterialRequestDetail.status === MaterialRequestStatus.NEW && user?.isEvaluator) {
			MaterialRequestsService.setAsPending(currentMaterialRequestDetail.id).then(() => {
				afterStatusChanged();
			});
		}
	}, [
		currentMaterialRequestDetail.id,
		currentMaterialRequestDetail.status,
		user?.isEvaluator,
		afterStatusChanged,
	]);

	const onFailedRequest = () => {
		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___er-ging-iets-mis'
			),
			description: tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___er-ging-iets-mis-tijdens-het-annuleren-van-de-aanvraag'
			),
		});
	};

	const onCancelRequest = async () => {
		try {
			setShowConfirmModal(false);
			const response = await MaterialRequestsService.cancel(currentMaterialRequestDetail.id);
			if (response === undefined) {
				onFailedRequest();
				return;
			}
			afterStatusChanged();
			onClose();
		} catch (_err) {
			onFailedRequest();
		}
	};

	const renderFooter = () => {
		if (canRequestBeEvaluated) {
			return (
				<div className={styles['p-account-my-material-requests__close-button-container']}>
					<Button
						label={tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___goedkeuren'
						)}
						variants={['block', 'primary']}
						onClick={onApproveRequest}
					/>
					<Button
						label={tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___afkeuren'
						)}
						variants={['block']}
						className={styles['p-account-my-material-requests__decline-button']}
						onClick={onDeclineRequest}
					/>
				</div>
			);
		}

		return (
			<div className={styles['p-account-my-material-requests__close-button-container']}>
				<Button
					label={tText(
						'modules/account/components/material-request-detail-blade/material-requests___sluit'
					)}
					variants={['block', 'black']}
					onClick={onClose}
				/>
				{currentMaterialRequestDetail.status === MaterialRequestStatus.NEW &&
					allowRequestCancellation &&
					currentMaterialRequestDetail.requesterId === user?.id && (
						<Button
							label={tText(
								'modules/account/components/material-request-detail-blade/material-request-detail-blade___annuleer-aanvraag'
							)}
							variants={['block', 'text']}
							onClick={() => setShowConfirmModal(true)}
						/>
					)}
			</div>
		);
	};

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
				className={styles['p-account-my-material-requests__content-block']}
			>
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

		const hasDownloadExpired = determineHasDownloadExpired(currentMaterialRequestDetail);
		const downloadExpirationDate = formatLongDate(
			asDate(currentMaterialRequestDetail.downloadExpiresAt)
		);

		return (
			<>
				{!hasDownloadExpired && (
					<Button
						className="u-mt-16"
						label={
							currentMaterialRequestDetail.downloadUrl
								? tText(
										'modules/account/components/material-request-detail-blade/material-request-detail-blade___downlooad-materiaal'
									)
								: tText(
										'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-in-voorbereiding'
									)
						}
						disabled={!currentMaterialRequestDetail.downloadUrl}
						variants={['block']}
						onClick={() => handleDownloadMaterialRequest(currentMaterialRequestDetail)}
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
							? tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-is-verlopen-op',
									{ downloadExpirationDate }
								)
							: tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-is-beschikbaar-tot-en-met',
									{ downloadExpirationDate }
								)}
					</span>
				)}
			</>
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
			...(currentMaterialRequestDetail.approvedAt
				? [
						tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___goedgekeurd-op',
							{
								approvedAt: formatLongDate(asDate(currentMaterialRequestDetail.approvedAt)),
							}
						),
					]
				: []),
			...(currentMaterialRequestDetail.deniedAt
				? [
						tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___geweigerd-op',
							{
								deniedAt: formatLongDate(asDate(currentMaterialRequestDetail.deniedAt)),
							}
						),
					]
				: []),
			...(currentMaterialRequestDetail.cancelledAt
				? [
						tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___geannulleerd-op',
							{
								cancelledAt: formatLongDate(asDate(currentMaterialRequestDetail.cancelledAt)),
							}
						),
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

	const renderMotivation = () => {
		if (
			currentMaterialRequestDetail.status !== MaterialRequestStatus.APPROVED &&
			currentMaterialRequestDetail.status !== MaterialRequestStatus.DENIED
		) {
			return null;
		}

		return renderContentBlock(
			tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___motivatie'
			),
			currentMaterialRequestDetail.statusMotivation
		);
	};

	const renderThumbnail = () => {
		const { objectThumbnailUrl, reuseForm } = currentMaterialRequestDetail;

		if (!reuseForm || !objectThumbnailUrl) {
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
					className={styles['p-account-my-material-requests__content-block-media']}
					src={objectThumbnailUrl}
					aria-hidden
					alt=""
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
			stickyFooter={canRequestBeEvaluated}
			onClose={onClose}
			id="material-request-detail-blade"
			layer={layer}
			currentLayer={currentLayer}
		>
			<div className={styles['p-account-my-material-requests__content-wrapper']}>
				<div className={styles['p-account-my-material-requests__content']}>
					<MaterialCard
						openInNewTab={true}
						objectId={currentMaterialRequestDetail.objectSchemaIdentifier}
						title={currentMaterialRequestDetail.objectSchemaName}
						thumbnail={currentMaterialRequestDetail.objectThumbnailUrl}
						hideThumbnail={true}
						orientation="vertical"
						link={itemLink}
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
						tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___naam-aanvraag'
						),
						currentMaterialRequestDetail.requestGroupName
					)}
					{renderMotivation()}
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
						undefined,
						currentMaterialRequestDetail.organisation
					)}
					{!currentMaterialRequestDetail.reuseForm &&
						renderContentBlock(
							tText(
								'modules/account/components/material-request-detail-blade/material-requests___reden'
							),
							currentMaterialRequestDetail.reason || '-'
						)}

					{!currentMaterialRequestDetail.reuseForm &&
						currentMaterialRequestDetail.requesterCapacity &&
						renderContentBlock(
							tText(
								'modules/account/components/material-request-detail-blade/material-requests___hoedanigheid'
							),
							GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD()[
								currentMaterialRequestDetail.requesterCapacity
							]
						)}

					{renderReuseForm()}
				</div>
			</div>
			<ConfirmationModal
				text={{
					yes: tHtml(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___verder-werken'
					),
					no: tHtml(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___ja-ik-ben-zeker'
					),
					description: tHtml(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___ben-je-zeker-dat-je-deze-aanvraag-wil-annuleren'
					),
				}}
				fullWidthButtonWrapper
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onCancel={onCancelRequest}
				onConfirm={() => setShowConfirmModal(false)}
			/>
		</Blade>
	);
};

export default MaterialRequestDetailBlade;
