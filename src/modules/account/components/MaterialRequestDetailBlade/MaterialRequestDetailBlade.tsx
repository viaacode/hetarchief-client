import { useGetMaterialRequestConversationUnreadCount } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestConversationUnreadCount';
import { useGetMaterialRequestStatus } from '@account/components/MaterialRequestDetailBlade/hooks/useGetMaterialRequestStatus';
import { MaterialRequestConversation } from '@account/components/MaterialRequestDetailBlade/MaterialRequestConversation';
import { MaterialRequestDownloadBlade } from '@account/components/MaterialRequestDownloadBlade/MaterialRequestDownloadBlade';
import { MaterialRequestEvaluateConditionsBlade } from '@account/components/MaterialRequestEvaluateConditionsBlade/MaterialRequestEvaluateConditionsBlade';
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
	type MaterialRequestMessage,
	type MaterialRequestMessageBodyAdditionalConditions,
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
import { isLessThanXlSize, isMobileSize } from '@shared/utils/is-mobile';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { isNil, noop } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import { StringParam, useQueryParam } from 'use-query-params';
import { MaterialRequestAdditionalConditionsBlade } from '../MaterialRequestAdditionalConditionsBlade/MaterialRequestAdditionalConditionsBlade';
import { MaterialRequestAdditionalConditionsResolutionBlade } from '../MaterialRequestAdditionalConditionsResolutionBlade/MaterialRequestAdditionalConditionsResolutionBlade';
import MaterialRequestContentInfo from './MaterialRequestContentInfo';
import styles from './MaterialRequestDetailBlade.module.scss';
import { MaterialRequestDocuments } from './MaterialRequestDocuments';
import { MATERIAL_REQUEST_DETAILS_TABS } from './material-request-detail-blade.consts';
import { MaterialRequestDetailBladeTabs } from './material-request-detail-blade.types';

interface MaterialRequestDetailBladeProps {
	onClose: (statusChanged: boolean) => void;
	allowRequestCancellation: boolean;
	currentMaterialRequestDetail: MaterialRequest | undefined;
}

export const MaterialRequestDetailBlade: FC<MaterialRequestDetailBladeProps> = ({
	onClose,
	allowRequestCancellation,
	currentMaterialRequestDetail,
}) => {
	const locale = useLocale();
	const user = useSelector(selectCommonUser);
	const { isObjectEssenceAccessibleToUser } = useIsComplexReuseFlow(currentMaterialRequestDetail);
	const isDetailBladeOpen = !!currentMaterialRequestDetail;

	// We need different functionalities for different viewport sizes
	const windowSize = useWindowSizeContext();
	const isMobile = isMobileSize(windowSize);
	const isTablePortrait = isLessThanXlSize(windowSize);
	const isKeyboardOpen = useDetectKeyboardOpen();

	const [showEvaluatorOptions, setShowEvaluatorOptions] = useState(false);
	const [isDetailStatusBladeOpenWithStatus, setIsDetailStatusBladeOpenWithStatus] = useState<
		MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED | undefined
	>(undefined);
	const [isAdditionalConditionsBladeOpen, setIsAdditionalConditionsBladeOpen] = useState(false);
	const [isAdditionalConditionsResolutionBladeOpen, setIsAdditionalConditionsResolutionBladeOpen] =
		useState(false);
	const [evaluateConditionsMessage, setEvaluateConditionsMessage] =
		useState<MaterialRequestMessage | null>(null);
	const [additionalConditions, setAdditionalConditions] =
		useState<MaterialRequestMessageBodyAdditionalConditions | null>(null);
	const [showCancelMaterialRequestConfirmModal, setShowCancelMaterialRequestConfirmModal] =
		useState(false);
	const [showMakeDownloadAvailableConfirmModal, setShowMakeDownloadAvailableConfirmModal] =
		useState(false);
	const [showAdditionalConditionsConfirmModal, setShowAdditionalConditionsConfirmModal] =
		useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [activeTabRaw, setActiveTab] = useQueryParam(QUERY_PARAM_KEY.ACTIVE_TAB, StringParam);
	const activeTab = activeTabRaw || MaterialRequestDetailBladeTabs.Information;

	const { data: materialRequestStatus, refetch: refetchMaterialRequestStatus } =
		useGetMaterialRequestStatus(
			currentMaterialRequestDetail?.id,
			// Only fetch the status when the request has a reuse form and is not archived
			!!currentMaterialRequestDetail?.reuseForm && !currentMaterialRequestDetail?.isArchived
		);

	const materialRequest: MaterialRequest | undefined = useMemo(() => {
		if (!currentMaterialRequestDetail) {
			return undefined;
		}

		return {
			...currentMaterialRequestDetail,
			...(materialRequestStatus || {}),
		};
	}, [currentMaterialRequestDetail, materialRequestStatus]);

	const hasStatusChanged = useMemo(
		() => currentMaterialRequestDetail?.status !== materialRequestStatus?.status,
		[currentMaterialRequestDetail, materialRequestStatus]
	);

	const isRequester = useMemo(
		() => materialRequest?.requesterId === user?.profileId,
		[materialRequest?.requesterId, user?.profileId]
	);
	const canUserEvaluate = useMemo(
		() => !!user?.isEvaluator && !isRequester,
		[user?.isEvaluator, isRequester]
	);
	const canRequestBeEvaluated = useMemo(
		() => materialRequest?.status === MaterialRequestStatus.PENDING && canUserEvaluate,
		[materialRequest?.status, canUserEvaluate]
	);
	const requestHasAdditionalConditionsAsked = useMemo(() => {
		const lastEvent = getLastEvent(materialRequest);
		return (
			materialRequest?.status === MaterialRequestStatus.PENDING &&
			lastEvent?.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS
		);
	}, [materialRequest]);

	const itemLink = useMemo(
		() =>
			materialRequest
				? stringifyUrl({
						url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${materialRequest.maintainerSlug}/${materialRequest.objectSchemaIdentifier}`,
						query: isNil(materialRequest.reuseForm?.endTime)
							? {}
							: {
									[QUERY_PARAM_KEY.CUE_POINTS]: [
										materialRequest.reuseForm?.startTime,
										materialRequest.reuseForm?.endTime,
									].join(CUE_POINTS_SEPARATOR),
								},
					})
				: '',
		[materialRequest, locale]
	);

	const hasFinalSummary = useMemo(
		() => getLastEvent(materialRequest)?.messageType === MaterialRequestEventType.FINAL_SUMMARY,
		[materialRequest]
	);

	const { data: unreadCount, refetch: refetchUnreadCount } =
		useGetMaterialRequestConversationUnreadCount(
			materialRequest?.id,
			// Only fetch the unreadCount when we are not on the conversation tab
			// And only when the request has a reuse form and is not yet closed with a final summary or is not archived
			activeTab !== MaterialRequestDetailBladeTabs.Conversation &&
				!!materialRequest?.reuseForm &&
				!hasFinalSummary &&
				!materialRequest?.isArchived
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

	// Set the status to pending when an evaluator opens a request with status new
	useEffect(() => {
		if (materialRequest?.status === MaterialRequestStatus.NEW && canUserEvaluate) {
			MaterialRequestsService.setAsPending(materialRequest.id).then(() =>
				refetchMaterialRequestStatus()
			);
		}
	}, [materialRequest?.id, materialRequest?.status, canUserEvaluate, refetchMaterialRequestStatus]);

	// Resetting the active tab on close of the blade
	useEffect(() => {
		if (!isDetailBladeOpen) {
			setActiveTab(MaterialRequestDetailBladeTabs.Information);
		}
	}, [isDetailBladeOpen, setActiveTab]);

	const onFailedRequest = () => {
		// Trigger this even when it fails because some step in the process could be the cause
		refetchMaterialRequestStatus().then(noop);

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

	const onFailedMakeDownloadAvailable = () => {
		// Trigger this even when it fails because some step in the process could be the cause
		refetchMaterialRequestStatus().then(noop);

		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/account/components/material-request-detail-blade/material-request-detail-blade___er-ging-iets-mis'
			),
			description: tText('Er ging iets mis tijdens het beschikbaar maken van de download'),
		});
	};

	const onCancelRequest = async () => {
		try {
			if (!materialRequest) {
				return;
			}
			setShowCancelMaterialRequestConfirmModal(false);
			const response = await MaterialRequestsService.cancel(materialRequest.id);
			if (response === undefined) {
				onFailedRequest();
				return;
			}
			refetchMaterialRequestStatus().then(noop);
		} catch (_err) {
			onFailedRequest();
		}
	};

	const onHandleDownload = () => {
		if (materialRequest) {
			handleDownloadMaterialRequest(materialRequest).then(setDownloadUrl);
		}
	};

	const onOpenEvaluateConditions = (message: MaterialRequestMessage) => {
		setEvaluateConditionsMessage(message);
	};

	const onMakeDownloadAvailable = async () => {
		try {
			if (!materialRequest) {
				return;
			}
			const response = await MaterialRequestsService.approve(materialRequest.id);
			if (!response) {
				onFailedMakeDownloadAvailable();
				return;
			}
			refetchMaterialRequestStatus().then(noop);
			toastService.notify({
				maxLines: 3,
				title: tText('Download beschikbaar maken gelukt'),
				description: tText('De download wordt nu voorbereid'),
			});
		} catch (_err) {
			onFailedMakeDownloadAvailable();
		}
	};

	const renderContent = () => {
		if (!materialRequest) {
			return null;
		}

		// No tabs to show, so always render all content in the blade
		if (
			!materialRequest.reuseForm ||
			materialRequest.isArchived ||
			activeTab === MaterialRequestDetailBladeTabs.Information
		) {
			return <MaterialRequestContentInfo currentMaterialRequestDetail={materialRequest} />;
		}

		switch (activeTab) {
			case MaterialRequestDetailBladeTabs.Conversation:
				return (
					<MaterialRequestConversation
						materialRequest={materialRequest}
						handleDownload={onHandleDownload}
						onMessagesLoaded={() => !!unreadCount && refetchUnreadCount().then(noop)}
						onOpenEvaluateConditions={onOpenEvaluateConditions}
						onMakeDownloadAvailable={() => setShowMakeDownloadAvailableConfirmModal(true)}
					/>
				);
			case MaterialRequestDetailBladeTabs.Documents:
				return <MaterialRequestDocuments materialRequest={materialRequest} />;
		}
	};

	const renderDownload = () => {
		if (!materialRequest) {
			return null;
		}

		const { downloadStatus } = materialRequest;
		const hasDownloadExpired = determineHasDownloadExpired(materialRequest);
		const downloadExpirationDate = formatMediumDate(asDate(materialRequest.downloadExpiresAt));
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
			} else if (!isTablePortrait) {
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
							downloadStatusFailed && styles['p-material-request-detail__download-message--failed']
						)}
					>
						{!isMobile && <Icon name={IconNamesLight.Exclamation} className="u-mr-4" />}
						{downloadInformationMessage}
					</span>
				)}
				{!hasDownloadExpired && !downloadStatusFailed && (
					<Button
						className={styles['p-material-request-detail__download-button']}
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
		if (!isRequester || !materialRequest) {
			return null;
		}

		// Is the requester allowed to cancel?
		if (materialRequest.status === MaterialRequestStatus.NEW && allowRequestCancellation) {
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
					variants={['outline']}
					onClick={() => setShowCancelMaterialRequestConfirmModal(true)}
				/>
			);
		}

		// Did the evaluator ask for additional conditions?
		if (requestHasAdditionalConditionsAsked) {
			const lastEvent = getLastEvent(materialRequest);
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
					onClick={() => onOpenEvaluateConditions(lastEvent as MaterialRequestMessage)}
				/>
			);
		}

		// Status is approved so render the download status
		if (materialRequest.status === MaterialRequestStatus.APPROVED) {
			return renderDownload();
		}
	};

	const renderCTA = () => {
		if (!materialRequest) {
			return null;
		}

		if (isRequester) {
			return renderRequesterCTA();
		}

		if (!canRequestBeEvaluated) {
			// Status is approved so render the download status
			if (materialRequest.status === MaterialRequestStatus.APPROVED && canUserEvaluate) {
				return renderDownload();
			}
			return null;
		}

		// Request can be evaluated and user has additional conditions approved
		const lastEvent = getLastEvent(materialRequest);
		if (
			materialRequest.status === MaterialRequestStatus.PENDING &&
			lastEvent?.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS_ACCEPTED
		) {
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
					onClick={() => setShowMakeDownloadAvailableConfirmModal(true)}
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
						currentMaterialRequestDetail={materialRequest}
						onApproveRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.APPROVED)
						}
						onDeclineRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.DENIED)
						}
						onRequestAdditionalConditions={() => setIsAdditionalConditionsBladeOpen(true)}
					/>
				</DropdownContent>
			</Dropdown>
		);
	};

	const getBladeHeaderProps = (includeCTAs: boolean): BladeHeaderProps => {
		if (!materialRequest?.reuseForm || materialRequest?.isArchived) {
			return {
				title: materialRequest?.isArchived
					? tText(
							'modules/account/components/material-request-detail-blade/material-request-detail-blade___gearchiveerde-aanvraag'
						)
					: tText(
							'modules/account/components/material-request-detail-blade/material-requests___detail'
						),
				stickySubtitle: !materialRequest?.isArchived && <MaterialRequestInformation />,
				subtitle: materialRequest ? (
					<MaterialCard
						openInNewTab={true}
						objectSchemaIdentifier={materialRequest.objectSchemaIdentifier}
						title={materialRequest.objectSchemaName}
						thumbnail={materialRequest.objectThumbnailUrl}
						hideThumbnail={true}
						orientation="vertical"
						link={itemLink}
						type={materialRequest.objectDctermsFormat ?? null}
						publishedBy={materialRequest.maintainerName}
						publishedOrCreatedDate={materialRequest.objectPublishedOrCreatedDate}
						icon={getIconFromObjectType(
							materialRequest.objectDctermsFormat,
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
			title: allowRequestCancellation
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
							{allowRequestCancellation
								? materialRequest.maintainerName
								: materialRequest.requesterOrganisation}
						</h3>
						{isMobile && (
							<div className={clsx(styles['p-material-request-detail__action-bar'])}>
								<MaterialRequestStatusPill status={materialRequest.status} showLabel />
								{includeCTAs && renderCTA()}
							</div>
						)}
						{!isMobile && <MaterialRequestStatusPill status={materialRequest.status} showLabel />}
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
		if (!materialRequest?.reuseForm || materialRequest?.isArchived) {
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
			customFooter: isMobile && !isKeyboardOpen && (
				<Tabs
					className={clsx(styles['p-material-request-detail__tabs'])}
					tabs={tabs}
					onClick={(tabId) => setActiveTab(tabId as MaterialRequestDetailBladeTabs)}
				/>
			),
		};
	};

	// Helper functions to calculate blade layers
	const getDetailBladeLayer = (): number => 1;

	const getEvaluatorOptionsBladeLayer = (): number => 2;

	const getStatusUpdateBladeLayer = (): number => (isMobile ? 3 : 2);

	const getAdditionalConditionsBladeLayer = (): number => (isMobile ? 3 : 2);

	const getAdditionalConditionsResolutionBladeLayer = (): number => (isMobile ? 4 : 3);

	const getEvaluateConditionsBladeLayer = (): number => (isMobile ? 3 : 2);

	const resetAdditionalConditionsFlow = () => {
		setShowAdditionalConditionsConfirmModal(false);
		setShowEvaluatorOptions(false);
		setIsAdditionalConditionsBladeOpen(false);
		setIsAdditionalConditionsResolutionBladeOpen(false);
		setAdditionalConditions(null);
	};

	const handleCloseAdditionalConditionsBlade = () => {
		// Check if there's any data filled in
		if (additionalConditions?.conditions.length) {
			setShowAdditionalConditionsConfirmModal(true);
		} else {
			// No data filled in, close without confirmation
			resetAdditionalConditionsFlow();
		}
	};

	// Handler for closing resolution blade (step 2) with confirmation
	const handleCloseResolutionBlade = () => {
		// Step 2 is only accessible if step 1 had data, so always show confirmation dialog
		setShowAdditionalConditionsConfirmModal(true);
	};

	// Handler for confirming the confirmation modal
	const handleConfirmAdditionalConditionsConfirmationModal = () => {
		setShowAdditionalConditionsConfirmModal(false);
	};

	// Handler for cancelling the confirmation modal
	const handleCancelAdditionalConditionsConfirmationModal = () => {
		resetAdditionalConditionsFlow();
	};

	const getBladeLayerIndex = () => {
		if (!materialRequest) {
			return 0;
		}

		if (isAdditionalConditionsResolutionBladeOpen) {
			return getAdditionalConditionsResolutionBladeLayer();
		}

		if (evaluateConditionsMessage) {
			return getEvaluateConditionsBladeLayer();
		}

		if (isDetailStatusBladeOpenWithStatus || isAdditionalConditionsBladeOpen) {
			return getAdditionalConditionsBladeLayer();
		}

		if (showEvaluatorOptions && isMobile) {
			return getEvaluatorOptionsBladeLayer();
		}

		if (isDetailBladeOpen) {
			return getDetailBladeLayer();
		}
		return 0;
	};

	return (
		<BladeManager
			currentLayer={getBladeLayerIndex()}
			onCloseBlade={() => {
				// Check deepest blade first (resolution blade - step 2)
				if (isAdditionalConditionsResolutionBladeOpen) {
					handleCloseResolutionBlade();
					return;
				}

				// Check additional conditions blade (step 1)
				if (isAdditionalConditionsBladeOpen) {
					handleCloseAdditionalConditionsBlade();
					return;
				}

				// Check evaluate conditions blade
				if (evaluateConditionsMessage) {
					setEvaluateConditionsMessage(null);
					return;
				}

				// Blade to approve/deny is open or on mobile we have evaluator options open
				if (isDetailStatusBladeOpenWithStatus || (isMobile && showEvaluatorOptions)) {
					setShowEvaluatorOptions(false);
					setIsDetailStatusBladeOpenWithStatus(undefined);
					return;
				}

				// Close the main detail blade
				onClose(hasStatusChanged);
			}}
			opacityStep={0.1}
		>
			<Blade
				id="material-request-detail-blade"
				className={clsx(styles['p-material-request-detail'])}
				isOpen={isDetailBladeOpen}
				layer={isDetailBladeOpen ? getDetailBladeLayer() : 99}
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
					isOpen={showCancelMaterialRequestConfirmModal}
					onClose={() => setShowCancelMaterialRequestConfirmModal(false)}
					onCancel={onCancelRequest}
					onConfirm={() => setShowCancelMaterialRequestConfirmModal(false)}
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
				layer={showEvaluatorOptions && isMobile ? getEvaluatorOptionsBladeLayer() : 99}
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
				{materialRequest && (
					<MaterialRequestEvaluatorOptions
						currentMaterialRequestDetail={materialRequest}
						onApproveRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.APPROVED)
						}
						onDeclineRequest={() =>
							setIsDetailStatusBladeOpenWithStatus(MaterialRequestStatus.DENIED)
						}
						onRequestAdditionalConditions={() => {
							setIsAdditionalConditionsBladeOpen(true);
						}}
					/>
				)}
			</Blade>
			<MaterialRequestStatusUpdateBlade
				isOpen={!!isDetailStatusBladeOpenWithStatus}
				onClose={() => {
					refetchMaterialRequestStatus().then(noop);
					setShowEvaluatorOptions(false);
					setIsDetailStatusBladeOpenWithStatus(undefined);
				}}
				status={isDetailStatusBladeOpenWithStatus}
				currentMaterialRequestDetail={materialRequest}
				layer={isDetailStatusBladeOpenWithStatus ? getStatusUpdateBladeLayer() : 99}
				currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
				hasPendingAdditionalConditions={requestHasAdditionalConditionsAsked}
			/>
			<MaterialRequestAdditionalConditionsBlade
				isOpen={isAdditionalConditionsBladeOpen}
				onClose={handleCloseAdditionalConditionsBlade}
				onSubmit={() => {
					setIsAdditionalConditionsResolutionBladeOpen(true);
				}}
				conditions={additionalConditions}
				onConditionsChange={setAdditionalConditions}
				layer={isAdditionalConditionsBladeOpen ? getAdditionalConditionsBladeLayer() : 99}
				currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
			/>

			<MaterialRequestAdditionalConditionsResolutionBlade
				isOpen={isAdditionalConditionsResolutionBladeOpen}
				onClose={handleCloseResolutionBlade}
				onBack={() => {
					setIsAdditionalConditionsResolutionBladeOpen(false);
				}}
				onSuccess={resetAdditionalConditionsFlow}
				conditions={additionalConditions}
				onConditionsChange={setAdditionalConditions}
				currentMaterialRequestDetail={materialRequest}
				layer={
					isAdditionalConditionsResolutionBladeOpen
						? getAdditionalConditionsResolutionBladeLayer()
						: 99
				}
				currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
			/>

			<MaterialRequestEvaluateConditionsBlade
				isOpen={!!evaluateConditionsMessage}
				onClose={() => setEvaluateConditionsMessage(null)}
				message={evaluateConditionsMessage}
				layer={evaluateConditionsMessage ? getEvaluateConditionsBladeLayer() : 99}
				currentLayer={isDetailBladeOpen ? getBladeLayerIndex() : 9999}
				materialRequestId={currentMaterialRequestDetail?.id}
				onSuccess={() => {
					setEvaluateConditionsMessage(null);
					refetchMaterialRequestStatus().then(noop);
				}}
			/>

			<ConfirmationModal
				isOpen={showAdditionalConditionsConfirmModal}
				onClose={handleCancelAdditionalConditionsConfirmationModal}
				onConfirm={handleConfirmAdditionalConditionsConfirmationModal}
				onCancel={handleCancelAdditionalConditionsConfirmationModal}
				fullWidthButtonWrapper
				text={{
					title: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___onopgeslagen-wijzigingen'
					),
					description: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___er-zijn-nog-onopgeslagen-wijzigingen-in-de-bijkomende-gebruiksvoorwaarden-weet-je-zeker-dat-je-wil-annuleren'
					),
					yes: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___nee-behoud-wijzigingen-in-de-bijkomende-gebruiksvoorwaarden'
					),
					no: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___ja-annuleer-wijzigingen-in-de-bijkomende-gebruiksvoorwaarden'
					),
				}}
			/>
			<ConfirmationModal
				isOpen={showMakeDownloadAvailableConfirmModal}
				onClose={() => setShowMakeDownloadAvailableConfirmModal(false)}
				onConfirm={() => {
					setShowMakeDownloadAvailableConfirmModal(false);
					onMakeDownloadAvailable();
				}}
				onCancel={() => setShowMakeDownloadAvailableConfirmModal(false)}
				fullWidthButtonWrapper
				text={{
					title: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___download-beschikbaar-maken'
					),
					description: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___ben-je-zeker-dat-je-de-download-beschikbaar-wil-maken'
					),
					yes: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___ja-download-beschikbaar-maken'
					),
					no: tText(
						'modules/account/components/material-request-detail-blade/material-request-detail-blade___annuleren'
					),
				}}
			/>
		</BladeManager>
	);
};
