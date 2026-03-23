import MaterialRequestDownloadBlade from '@account/components/MaterialRequestDownloadBlade/MaterialRequestDownloadBlade';
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
	type MaterialRequest,
	type MaterialRequestDownloadQuality,
	MaterialRequestDownloadStatus,
	MaterialRequestStatus,
} from '@material-requests/types';
import { AdminConfigManager } from '@meemoo/admin-core-ui/admin';
import { Button, type TabProps, Tabs } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import {
	type BladeFooterButton,
	BladeFooterButtonProps,
	type BladeFooterProps,
	type BladeHeaderProps,
} from '@shared/components/Blade/Blade.types';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { CUE_POINTS_SEPARATOR, QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { toastService } from '@shared/services/toast-service';
import { IeObjectType } from '@shared/types/ie-objects';
import { asDate, formatLongDate } from '@shared/utils/dates';
import { isMobileSize } from '@shared/utils/is-mobile';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { default as NextLink } from 'next/link';
import { stringifyUrl } from 'query-string';
import React, { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './MaterialRequestDetailBlade.module.scss';
import { MATERIAL_REQUEST_DETAILS_TABS } from './material-request-detail-blade.consts';
import { MaterialRequestDetailBladeTabs } from './material-request-detail-blade.types';

interface MaterialRequestDetailBladeProps {
	isOpen: boolean;
	onClose: (statusChanged: boolean) => void;
	allowRequestCancellation: boolean;
	onApproveRequest?: () => void;
	onDeclineRequest?: () => void;
	currentMaterialRequestDetail: MaterialRequest;
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
	const { isObjectEssenceAccessibleToUser } = useIsComplexReuseFlow(currentMaterialRequestDetail);

	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

	const [hasStatusChanged, setHasStatusChanged] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<MaterialRequestDetailBladeTabs>(
		MaterialRequestDetailBladeTabs.Information
	);

	const handleStatusChanged = useCallback(() => {
		setHasStatusChanged(true);
		afterStatusChanged();
	}, [afterStatusChanged]);

	const isRequester = useMemo(
		() => currentMaterialRequestDetail.requesterId === user?.id,
		[currentMaterialRequestDetail.requesterId, user?.id]
	);
	const canUserEvaluate = useMemo(
		() => !!user?.isEvaluator && !isRequester,
		[user?.isEvaluator, isRequester]
	);
	const canRequestBeEvaluated = useMemo(
		() => currentMaterialRequestDetail.status === MaterialRequestStatus.PENDING && canUserEvaluate,
		[currentMaterialRequestDetail.status, canUserEvaluate]
	);
	const itemLink = useMemo(
		() =>
			currentMaterialRequestDetail
				? stringifyUrl({
						url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${currentMaterialRequestDetail.maintainerSlug}/${currentMaterialRequestDetail.objectSchemaIdentifier}`,
						query: isNil(currentMaterialRequestDetail.reuseForm?.endTime)
							? {}
							: {
									[QUERY_PARAM_KEY.CUE_POINTS]: [
										currentMaterialRequestDetail.reuseForm?.startTime,
										currentMaterialRequestDetail.reuseForm?.endTime,
									].join(CUE_POINTS_SEPARATOR),
								},
					})
				: '',
		[currentMaterialRequestDetail, locale]
	);

	const tabs: TabProps[] = useMemo(
		() => MATERIAL_REQUEST_DETAILS_TABS(activeTab, isRequester || canUserEvaluate, isMobile),
		[isMobile, isRequester, canUserEvaluate, activeTab]
	);

	useEffect(() => {
		if (currentMaterialRequestDetail.status === MaterialRequestStatus.NEW && canUserEvaluate) {
			MaterialRequestsService.setAsPending(currentMaterialRequestDetail.id).then(() => {
				handleStatusChanged();
			});
		}
	}, [
		currentMaterialRequestDetail.id,
		currentMaterialRequestDetail.status,
		canUserEvaluate,
		handleStatusChanged,
	]);

	// Resetting the active tab on close of the blade
	useEffect(() => {
		if (!isOpen) {
			setActiveTab(MaterialRequestDetailBladeTabs.Information);
		}
	}, [isOpen]);

	const onFailedRequest = () => {
		handleStatusChanged(); // Trigger this even when it fails because some step in the process could be the cause

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
			handleStatusChanged();
		} catch (_err) {
			onFailedRequest();
		}
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

	const renderDownload = () => {
		if (currentMaterialRequestDetail.status !== MaterialRequestStatus.APPROVED) {
			return null;
		}

		const { downloadStatus } = currentMaterialRequestDetail;
		const hasDownloadExpired = determineHasDownloadExpired(currentMaterialRequestDetail);
		const downloadExpirationDate = formatLongDate(
			asDate(currentMaterialRequestDetail.downloadExpiresAt)
		);
		const downloadStatusSucceeded = downloadStatus === MaterialRequestDownloadStatus.SUCCEEDED;
		const downloadStatusFailed = downloadStatus === MaterialRequestDownloadStatus.FAILED;
		let downloadInformationMessage = '';

		if (downloadStatusFailed) {
			downloadInformationMessage = tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-voorbereiding-gefaald'
			);
		} else if (downloadExpirationDate) {
			if (hasDownloadExpired) {
				downloadInformationMessage = tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-is-verlopen-op',
					{ downloadExpirationDate }
				);
			} else {
				downloadInformationMessage = tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-is-beschikbaar-tot-en-met',
					{ downloadExpirationDate }
				);
			}
		}

		return (
			<>
				{!hasDownloadExpired && !downloadStatusFailed && (
					<Button
						className="u-mt-16"
						label={
							downloadStatusSucceeded
								? tText(
										'modules/account/components/material-request-detail-blade/material-request-detail-blade___downlooad-materiaal'
									)
								: tText(
										'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-in-voorbereiding'
									)
						}
						disabled={!downloadStatusSucceeded}
						variants={['block']}
						onClick={() =>
							handleDownloadMaterialRequest(currentMaterialRequestDetail).then(setDownloadUrl)
						}
					/>
				)}

				{downloadInformationMessage && (
					<span
						className={clsx(
							styles['p-material-request-detail__content-block-value'],
							'u-flex',
							'u-align-center',
							'u-flex-row',
							'u-pt-12'
						)}
					>
						<Icon name={IconNamesLight.Exclamation} className="u-mr-4" />
						{downloadInformationMessage}
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

	const renderContent = () => {
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
						currentMaterialRequestDetail.requesterOrganisationSector,
						currentMaterialRequestDetail.requesterOrganisation
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
				</>
			);
		}

		switch (activeTab) {
			case MaterialRequestDetailBladeTabs.Information: {
				return (
					<>
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
							currentMaterialRequestDetail.requesterOrganisationSector,
							currentMaterialRequestDetail.requesterOrganisation
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
					</>
				);
			}
			case MaterialRequestDetailBladeTabs.Conversation:
				return null;
			case MaterialRequestDetailBladeTabs.Documents:
				return null;
		}
	};

	const getBladeHeaderProps = (): BladeHeaderProps => {
		if (!currentMaterialRequestDetail.reuseForm) {
			return {
				title: tText(
					'modules/account/components/material-request-detail-blade/material-requests___detail'
				),
				stickySubtitle: <MaterialRequestInformation />,
				subtitle: (
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
							isObjectEssenceAccessibleToUser
						)}
					/>
				),
			};
		}

		return {
			isWideBlade: true,
			showHeaderBackgroundByDefault: true,
			showTitleSmaller: true,
			title: isRequester ? tText('Aanvraag aan') : tText('Aanvraag van'),
			stickySubtitle: (
				<>
					<div className={clsx(styles['p-material-request-detail__title'])}>
						<h3 className={clsx(styles['p-material-request-detail__title--text'])}>
							{currentMaterialRequestDetail.maintainerName}
						</h3>
						<MaterialRequestStatusPill status={currentMaterialRequestDetail.status} showLabel />
					</div>
					{!isMobile && (
						<Tabs
							className={clsx(styles['p-material-request-detail__tabs'])}
							tabs={tabs}
							onClick={(tabId) => setActiveTab(tabId as MaterialRequestDetailBladeTabs)}
						/>
					)}
				</>
			),
		};
	};

	const getBladeFooterProps = (): BladeFooterProps => {
		if (!currentMaterialRequestDetail.reuseForm) {
			return {
				footerButtons: [
					{
						label: tText(
							'modules/account/components/material-request-detail-blade/material-requests___sluit'
						),
						mobileLabel: tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___sluit-mobiel'
						),
						type: 'primary',
						onClick: () => onClose(hasStatusChanged),
					} as BladeFooterButton,
				],
			};
		}

		return {
			footerButtons: undefined,
			ignoreFooterButtons: true,
			stickyFooter: true,
			customFooter: isMobile && (
				<Tabs
					className={clsx(styles['p-material-request-detail__tabs'])}
					tabs={tabs}
					onClick={(tabId) => setActiveTab(tabId as MaterialRequestDetailBladeTabs)}
				/>
			),
		};
	};

	return (
		<>
			<Blade
				id="material-request-detail-blade"
				className={clsx(styles['p-material-request-detail'])}
				isOpen={isOpen}
				layer={layer}
				currentLayer={currentLayer}
				onClose={() => onClose(hasStatusChanged)}
				ariaLabel={tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___materiaal-aanvraag-detail-blade-aria-label'
				)}
				{...getBladeHeaderProps()}
				{...getBladeFooterProps()}
			>
				<div className={styles['p-material-request-detail__content-wrapper']}>
					<div className={styles['p-material-request-detail__content']}>{renderContent()}</div>
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
			<MaterialRequestDownloadBlade
				location="material-request-download-button"
				downloadUrl={downloadUrl}
				onClose={() => setDownloadUrl(null)}
			/>
		</>
	);
};

export default MaterialRequestDetailBlade;
