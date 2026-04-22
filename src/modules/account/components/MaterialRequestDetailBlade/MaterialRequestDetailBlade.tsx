import { useGetMaterialRequestConversationUnreadCount } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationUnreadCount';
import { MaterialRequestConversation } from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversation';
import { MaterialRequestDownloadBlade } from '@account/components/MaterialRequestDownloadBlade/MaterialRequestDownloadBlade';
import { MaterialRequestEvaluatorOptions } from '@account/components/MaterialRequestEvaluatorOptions/MaterialRequestEvaluatorOptions';
import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import { MaterialRequestStatusUpdateBlade } from '@account/components/MaterialRequestStatusUpdateBlade/MaterialRequestStatusUpdateBlade';
import { getLastEvent } from '@account/utils/get-last-material-request-event';
import {
	determineHasDownloadExpired,
	handleDownloadMaterialRequest,
} from '@account/utils/handle-download-material-request';
import { selectCommonUser } from '@auth/store/user';
import { MaterialRequestsService } from '@material-requests/services';
import {
	type MaterialRequest,
	MaterialRequestDownloadStatus,
	MaterialRequestEventType,
	MaterialRequestStatus,
} from '@material-requests/types';
import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	type TabProps,
	Tabs,
} from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import {
	type BladeFooterButton,
	type BladeFooterProps,
	type BladeHeaderProps,
	BladeSizeType,
} from '@shared/components/Blade/Blade.types';
import { BladeManager } from '@shared/components/BladeManager';
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
import { asDate, formatMediumDate } from '@shared/utils/dates';
import { isMobileSize } from '@shared/utils/is-mobile';
import type { QueryObserverResult } from '@tanstack/react-query';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { isNil, noop } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import React, { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParam } from 'use-query-params';
import MaterialRequestContentInfo from './MaterialRequestContentInfo';
import styles from './MaterialRequestDetailBlade.module.scss';
import { MaterialRequestDocuments } from './MaterialRequestDocuments';
import { MATERIAL_REQUEST_DETAILS_TABS } from './material-request-detail-blade.consts';
import { MaterialRequestDetailBladeTabs } from './material-request-detail-blade.types';

interface MaterialRequestDetailBladeProps {
	onClose: (statusChanged: boolean) => void;
	allowRequestCancellation: boolean;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	refetchMaterialRequest: () => Promise<QueryObserverResult<MaterialRequest | null, Error>>;
	afterStatusChanged: () => void;
}

export const MaterialRequestDetailBlade: FC<MaterialRequestDetailBladeProps> = ({
	onClose,
	allowRequestCancellation,
	currentMaterialRequestDetail,
	refetchMaterialRequest,
	afterStatusChanged,
}) => {
	const locale = useLocale();
	const user = useSelector(selectCommonUser);
	const { isObjectEssenceAccessibleToUser } = useIsComplexReuseFlow(currentMaterialRequestDetail);
	const isDetailBladeOpen = !!currentMaterialRequestDetail;

	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);

	const [showEvaluatorOptions, setShowEvaluatorOptions] = useState(false);
	const [hasStatusChanged, setHasStatusChanged] = useState(false);
	const [isDetailStatusBladeOpenWithStatus, setIsDetailStatusBladeOpenWithStatus] = useState<
		MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED | undefined
	>(undefined);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [activeTabRaw, setActiveTab] = useQueryParam(QUERY_PARAM_KEY.ACTIVE_TAB, StringParam);
	const activeTab = activeTabRaw || MaterialRequestDetailBladeTabs.Information;

	const handleStatusChanged = useCallback(() => {
		setHasStatusChanged(true);
		afterStatusChanged();
	}, [afterStatusChanged]);

	const isRequester = useMemo(
		() => currentMaterialRequestDetail?.requesterId === user?.profileId,
		[currentMaterialRequestDetail?.requesterId, user?.profileId]
	);
	const canUserEvaluate = useMemo(
		() => !!user?.isEvaluator && !isRequester,
		[user?.isEvaluator, isRequester]
	);
	const canRequestBeEvaluated = useMemo(
		() => currentMaterialRequestDetail?.status === MaterialRequestStatus.PENDING && canUserEvaluate,
		[currentMaterialRequestDetail?.status, canUserEvaluate]
	);
	const requestHasAdditionalConditionsAsked = useMemo(() => {
		const lastEvent = getLastEvent(currentMaterialRequestDetail);
		return (
			currentMaterialRequestDetail?.status === MaterialRequestStatus.PENDING &&
			lastEvent?.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS
		);
	}, [currentMaterialRequestDetail]);

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

	const { data: unreadCount, refetch: refetchUnreadCount } =
		useGetMaterialRequestConversationUnreadCount(
			currentMaterialRequestDetail?.id,
			activeTab !== MaterialRequestDetailBladeTabs.Conversation
		);

	const tabs: TabProps[] = useMemo(
		() =>
			MATERIAL_REQUEST_DETAILS_TABS(
				activeTab as MaterialRequestDetailBladeTabs,
				isRequester || canUserEvaluate,
				isMobile,
				unreadCount?.count ?? 0
			),
		[isMobile, isRequester, canUserEvaluate, activeTab, unreadCount]
	);

	useEffect(() => {
		if (currentMaterialRequestDetail?.status === MaterialRequestStatus.NEW && canUserEvaluate) {
			MaterialRequestsService.setAsPending(currentMaterialRequestDetail.id).then(() => {
				handleStatusChanged();
			});
		}
	}, [
		currentMaterialRequestDetail?.id,
		currentMaterialRequestDetail?.status,
		canUserEvaluate,
		handleStatusChanged,
	]);

	// Resetting the active tab on close of the blade
	useEffect(() => {
		if (!isDetailBladeOpen) {
			setActiveTab(MaterialRequestDetailBladeTabs.Information);
		}
	}, [isDetailBladeOpen, setActiveTab]);

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
			if (!currentMaterialRequestDetail) {
				return;
			}
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

	const onHandleDownload = () => {
		if (currentMaterialRequestDetail) {
			handleDownloadMaterialRequest(currentMaterialRequestDetail).then(setDownloadUrl);
		}
	};

	const renderContent = () => {
		if (!currentMaterialRequestDetail) {
			return null;
		}

		// No tabs to show, so always render all content in the blade
		if (
			!currentMaterialRequestDetail.reuseForm ||
			currentMaterialRequestDetail.isArchived ||
			activeTab === MaterialRequestDetailBladeTabs.Information
		) {
			return (
				<MaterialRequestContentInfo currentMaterialRequestDetail={currentMaterialRequestDetail} />
			);
		}

		switch (activeTab) {
			case MaterialRequestDetailBladeTabs.Conversation:
				return (
					<MaterialRequestConversation
						materialRequest={currentMaterialRequestDetail}
						refetchMaterialRequest={refetchMaterialRequest}
						handleDownload={onHandleDownload}
						onMessagesLoaded={() => refetchUnreadCount().then(noop)}
					/>
				);
			case MaterialRequestDetailBladeTabs.Documents:
				return <MaterialRequestDocuments materialRequest={currentMaterialRequestDetail} />;
		}
	};

	const renderDownload = () => {
		if (!currentMaterialRequestDetail) {
			return null;
		}

		const { downloadStatus } = currentMaterialRequestDetail;
		const hasDownloadExpired = determineHasDownloadExpired(currentMaterialRequestDetail);
		const downloadExpirationDate = formatMediumDate(
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
				downloadInformationMessage = isMobile
					? tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-verlopen-op-mobiel',
							{ downloadExpirationDate }
						)
					: tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-is-verlopen-op',
							{ downloadExpirationDate }
						);
			} else if (!isMobile) {
				// We only want to show the expiration date on desktop
				downloadInformationMessage = tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-is-beschikbaar-tot-en-met',
					{ downloadExpirationDate }
				);
			}
		}

		return (
			<>
				{downloadInformationMessage && (
					<span
						className={clsx(
							styles['p-material-request-detail__download-message'],
							'u-flex',
							'u-align-center',
							'u-flex-row',
							'u-pt-12',
							'u-mr-8'
						)}
					>
						{!isMobile && <Icon name={IconNamesLight.Exclamation} className="u-mr-4" />}
						{downloadInformationMessage}
					</span>
				)}
				{!hasDownloadExpired && !downloadStatusFailed && (
					<Button
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
						variants={['inline-block', 'dark']}
						onClick={() => onHandleDownload()}
					/>
				)}
			</>
		);
	};

	const renderRequesterCTA = () => {
		if (!isRequester || !currentMaterialRequestDetail) {
			return null;
		}

		// Is the requester allowed to cancel?
		if (
			currentMaterialRequestDetail.status === MaterialRequestStatus.NEW &&
			allowRequestCancellation
		) {
			return (
				<Button
					className={clsx(styles['p-material-request-detail__cancel-button'])}
					label={
						isMobile
							? tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___annuleer-aanvraag-mobiel'
								)
							: tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___annuleer-aanvraag'
								)
					}
					variants={['dark']}
					onClick={() => setShowConfirmModal(true)}
				/>
			);
		}

		// Did the evaluator ask for additional conditions?
		if (requestHasAdditionalConditionsAsked) {
			// TODO: add logic to evaluate additional conditions
			return (
				<Button
					label={
						isMobile
							? tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___voorwaarden-evalueren-mobiel'
								)
							: tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___voorwaarden-evalueren'
								)
					}
					variants={['dark']}
				/>
			);
		}

		// Status is approved so render the download status
		if (currentMaterialRequestDetail.status === MaterialRequestStatus.APPROVED) {
			return renderDownload();
		}
	};

	const renderCTA = () => {
		if (!currentMaterialRequestDetail) {
			return null;
		}

		if (isRequester) {
			return renderRequesterCTA();
		}

		if (!canRequestBeEvaluated) {
			// Status is approved so render the download status
			if (
				currentMaterialRequestDetail.status === MaterialRequestStatus.APPROVED &&
				canUserEvaluate
			) {
				return renderDownload();
			}
			return null;
		}

		// Request can be evaluated and user has additional conditions approved
		const lastEvent = getLastEvent(currentMaterialRequestDetail);
		if (
			currentMaterialRequestDetail.status === MaterialRequestStatus.PENDING &&
			lastEvent?.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS_ACCEPTED
		) {
			// TODO: add logic for manual start of the download
			return (
				<Button
					label={
						isMobile
							? tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-beschikbaar-maken-mobiel'
								)
							: tText(
									'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-beschikbaar-maken'
								)
					}
					variants={['dark']}
				/>
			);
		}

		if (isMobile) {
			return (
				<Button
					variants={['dark']}
					label={tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvraag-beoordelen-mobiel'
					)}
					onClick={() => setShowEvaluatorOptions(true)}
				></Button>
			);
		}

		return (
			<Dropdown
				isOpen={showEvaluatorOptions}
				onOpen={() => setShowEvaluatorOptions(true)}
				onClose={() => setShowEvaluatorOptions(false)}
				id="material-request-evaluator-dropdown"
				placement="bottom-end"
				flyoutClassName={clsx(styles['p-material-request-detail__evaluator-dropdown-flyout'])}
			>
				<DropdownButton>
					<Button
						variants={['dark']}
						iconEnd={
							<Icon
								name={showEvaluatorOptions ? IconNamesLight.AngleUp : IconNamesLight.AngleDown}
								aria-hidden
							/>
						}
						label={tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvraag-beoordelen'
						)}
					></Button>
				</DropdownButton>
				<DropdownContent>
					<MaterialRequestEvaluatorOptions
						currentMaterialRequestDetail={currentMaterialRequestDetail}
						onApproveRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.APPROVED)
						}
						onDeclineRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.DENIED)
						}
						// TODO: add logic to request additional conditions
						onRequestAdditionalConditions={noop}
					/>
				</DropdownContent>
			</Dropdown>
		);
	};

	const getBladeHeaderProps = (includeCTAs: boolean): BladeHeaderProps => {
		if (!currentMaterialRequestDetail?.reuseForm || currentMaterialRequestDetail?.isArchived) {
			return {
				title: currentMaterialRequestDetail?.isArchived
					? tText('Gearchiveerde aanvraag')
					: tText(
							'modules/account/components/material-request-detail-blade/material-requests___detail'
						),
				stickySubtitle: !currentMaterialRequestDetail?.isArchived && <MaterialRequestInformation />,
				subtitle: currentMaterialRequestDetail ? (
					<MaterialCard
						openInNewTab={true}
						objectSchemaIdentifier={currentMaterialRequestDetail.objectSchemaIdentifier}
						title={currentMaterialRequestDetail.objectSchemaName}
						thumbnail={currentMaterialRequestDetail.objectThumbnailUrl}
						hideThumbnail={true}
						orientation="vertical"
						link={itemLink}
						type={currentMaterialRequestDetail.objectDctermsFormat ?? null}
						publishedBy={currentMaterialRequestDetail.maintainerName}
						publishedOrCreatedDate={currentMaterialRequestDetail.objectPublishedOrCreatedDate}
						icon={getIconFromObjectType(
							currentMaterialRequestDetail.objectDctermsFormat,
							isObjectEssenceAccessibleToUser
						)}
					/>
				) : null,
				size: BladeSizeType.THIN,
			};
		}

		return {
			size: isMobile ? BladeSizeType.THIN : BladeSizeType.WIDE,
			showHeaderBackgroundByDefault: true,
			showTitleSmaller: true,
			title: isRequester
				? tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvraag-aan'
					)
				: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___aanvraag-van'
					),
			stickySubtitle: (
				<>
					<div className={clsx(styles['p-material-request-detail__title'])}>
						<h3 className={clsx(styles['p-material-request-detail__title--text'])}>
							{currentMaterialRequestDetail.maintainerName}
						</h3>
						{isMobile && (
							<div className={clsx(styles['p-material-request-detail__action-bar'])}>
								<MaterialRequestStatusPill status={currentMaterialRequestDetail.status} showLabel />
								{includeCTAs && renderCTA()}
							</div>
						)}
						{!isMobile && (
							<MaterialRequestStatusPill status={currentMaterialRequestDetail.status} showLabel />
						)}
					</div>
					{!isMobile && (
						<div className={clsx(styles['p-material-request-detail__action-bar'])}>
							<Tabs
								className={clsx(styles['p-material-request-detail__tabs'])}
								tabs={tabs}
								onClick={(tabId) => setActiveTab(tabId as MaterialRequestDetailBladeTabs)}
							/>
							{includeCTAs && renderCTA()}
						</div>
					)}
				</>
			),
		};
	};

	const getBladeFooterProps = (): BladeFooterProps => {
		if (!currentMaterialRequestDetail?.reuseForm || currentMaterialRequestDetail?.isArchived) {
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
			removePaddingForCustomFooter: isMobile,
			customFooter: isMobile && (
				<Tabs
					className={clsx(styles['p-material-request-detail__tabs'])}
					tabs={tabs}
					onClick={(tabId) => setActiveTab(tabId as MaterialRequestDetailBladeTabs)}
				/>
			),
		};
	};

	const getBladeLayerIndex = () => {
		if (!currentMaterialRequestDetail) {
			return 0;
		}

		if (isDetailStatusBladeOpenWithStatus) {
			if (isMobile) {
				return 3;
			}
			return 2;
		}

		if (showEvaluatorOptions && isMobile) {
			return 2;
		}

		if (isDetailBladeOpen) {
			return 1;
		}
		return 0;
	};

	return (
		<BladeManager
			currentLayer={getBladeLayerIndex()}
			onCloseBlade={() => {
				// Blade to approve/deny is open or
				// On mobile we have evaluator options open
				if (isDetailStatusBladeOpenWithStatus || (isMobile && showEvaluatorOptions)) {
					setShowEvaluatorOptions(false); // close evaluator options
					setIsDetailStatusBladeOpenWithStatus(undefined); // close status blade
				} else {
					onClose(hasStatusChanged);
				}
			}}
			opacityStep={0.1}
		>
			<Blade
				id="material-request-detail-blade"
				className={clsx(styles['p-material-request-detail'])}
				isOpen={isDetailBladeOpen}
				layer={isDetailBladeOpen ? 1 : 99}
				currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
				onClose={() => onClose(hasStatusChanged)}
				ariaLabel={tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___materiaal-aanvraag-detail-blade-aria-label'
				)}
				{...getBladeHeaderProps(true)}
				{...getBladeFooterProps()}
			>
				<div className={clsx(styles['p-material-request-detail__content-wrapper'])}>
					{renderContent()}
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
			<Blade
				id="material-request-evaluation-detail-blade"
				isOpen={isMobile && showEvaluatorOptions}
				layer={showEvaluatorOptions && isMobile ? 2 : 99}
				currentLayer={showEvaluatorOptions ? getBladeLayerIndex() : 9999}
				onClose={() => setShowEvaluatorOptions(false)}
				ariaLabel={tText(
					'modules/account/components/material-request-detail-blade/material-request-detail-blade___materiaal-aanvraag-evaluation-detail-blade-aria-label'
				)}
				{...getBladeHeaderProps(false)}
				footerButtons={[
					{
						label: tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___keer-terug'
						),
						mobileLabel: tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___keer-terug'
						),
						type: 'secondary',
						enforceSecondary: true,
						onClick: () => setShowEvaluatorOptions(false),
					} as BladeFooterButton,
				]}
			>
				{currentMaterialRequestDetail && (
					<MaterialRequestEvaluatorOptions
						currentMaterialRequestDetail={currentMaterialRequestDetail}
						onApproveRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.APPROVED)
						}
						onDeclineRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.DENIED)
						}
						// TODO: add logic to request additional conditions
						onRequestAdditionalConditions={noop}
					/>
				)}
			</Blade>
			<MaterialRequestStatusUpdateBlade
				isOpen={!!isDetailStatusBladeOpenWithStatus}
				onClose={(statusUpdated) => {
					if (statusUpdated) {
						setHasStatusChanged(true);
					}
					setShowEvaluatorOptions(false);
					setIsDetailStatusBladeOpenWithStatus(undefined);
				}}
				status={isDetailStatusBladeOpenWithStatus}
				currentMaterialRequestDetail={currentMaterialRequestDetail}
				afterStatusChanged={afterStatusChanged}
				layer={isDetailBladeOpen ? (isMobile ? 3 : 2) : 99}
				currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
			/>
		</BladeManager>
	);
};
