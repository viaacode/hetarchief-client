import MaterialRequestDownloadBlade from '@account/components/MaterialRequestDownloadBlade/MaterialRequestDownloadBlade';
import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import {
	determineHasDownloadExpired,
	handleDownloadMaterialRequest,
} from '@account/utils/handle-download-material-request';
import { selectUser } from '@auth/store/user';
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
import type {
	BladeFooterButton,
	BladeFooterProps,
	BladeHeaderProps,
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
import { asDate, formatLongDate } from '@shared/utils/dates';
import { isMobileSize } from '@shared/utils/is-mobile';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import React, { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import MaterialRequestContentInfo from './MaterialRequestContentInfo';
import styles from './MaterialRequestDetailBlade.module.scss';
import {
	isLatestEventStatus,
	MATERIAL_REQUEST_DETAILS_TABS,
} from './material-request-detail-blade.consts';
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

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
	const requestHasAdditionalConditionsAsked = useMemo(
		() =>
			isLatestEventStatus(
				currentMaterialRequestDetail,
				MaterialRequestEventType.ADDITIONAL_CONDITIONS
			),
		[currentMaterialRequestDetail]
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

	const renderContent = () => {
		// No tabs to show, so always render all content in the blade
		if (
			!currentMaterialRequestDetail.reuseForm ||
			activeTab === MaterialRequestDetailBladeTabs.Information
		) {
			return (
				<MaterialRequestContentInfo currentMaterialRequestDetail={currentMaterialRequestDetail} />
			);
		}

		switch (activeTab) {
			case MaterialRequestDetailBladeTabs.Conversation:
				return null;
			case MaterialRequestDetailBladeTabs.Documents:
				return null;
		}
	};

	const renderDownload = () => {
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
						<Icon name={IconNamesLight.Exclamation} className="u-mr-4" />
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
						variants={['inline-block']}
						onClick={() =>
							handleDownloadMaterialRequest(currentMaterialRequestDetail).then(setDownloadUrl)
						}
					/>
				)}
			</>
		);
	};

	const renderRequesterCTA = () => {
		if (!isRequester) {
			return null;
		}

		// Is the requester allowed to cancel?
		if (
			currentMaterialRequestDetail.status === MaterialRequestStatus.NEW &&
			allowRequestCancellation
		) {
			return (
				<Button
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
					label={isMobile ? tText('Voorwaarden evalueren mobiel') : tText('Voorwaarden evalueren')}
					variants={['dark']}
				/>
			);
		}

		// Status is approved so render the download status
		if (currentMaterialRequestDetail.status === MaterialRequestStatus.APPROVED) {
			return renderDownload();
		}
	};

	const renderEvaluatorButton = (
		type: string,
		icon: IconNamesLight,
		label: string,
		description: string,
		disabled = false,
		onClick?: () => void
	) => {
		return (
			<Button
				className={clsx(
					styles['p-material-request-detail__evalutator-dropdown__button'],
					styles[`p-material-request-detail__evalutator-dropdown__button-${type}`]
				)}
				ariaLabel={label}
				disabled={disabled}
				onClick={() => onClick?.()}
			>
				<div
					className={clsx(styles['p-material-request-detail__evalutator-dropdown__button-title'])}
				>
					<Icon
						className={clsx(styles['p-material-request-detail__evalutator-dropdown__button-icon'])}
						name={icon}
					/>
					{label}
				</div>
				<span
					className={clsx(
						styles['p-material-request-detail__evalutator-dropdown__button-description']
					)}
				>
					{description}
				</span>
			</Button>
		);
	};

	const renderCTA = () => {
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
		if (
			isLatestEventStatus(
				currentMaterialRequestDetail,
				MaterialRequestEventType.ADDITIONAL_CONDITIONS_ACCEPTED
			)
		) {
			// TODO: add logic for manual start of the download
			return (
				<Button
					label={
						isMobile
							? tText('Download beschikbaar maken mobiel')
							: tText('Download beschikbaar maken')
					}
					variants={['dark']}
				/>
			);
		}

		return (
			<Dropdown
				isOpen={isDropdownOpen}
				onOpen={() => setIsDropdownOpen(true)}
				onClose={() => setIsDropdownOpen(false)}
				id="material-request-evaluator-dropdown"
				placement="bottom-end"
				className={clsx(styles['p-material-request-detail__evalutator-dropdown'])}
				flyoutClassName={clsx(styles['p-material-request-detail__evalutator-dropdown-flyout'])}
			>
				<DropdownButton>
					<Button
						variants={['dark']}
						iconEnd={
							<Icon
								name={isDropdownOpen ? IconNamesLight.AngleUp : IconNamesLight.AngleDown}
								aria-hidden
							/>
						}
						label={isMobile ? tText('Aanvraag beoordelen mobiel') : tText('Aanvraag beoordelen')}
					></Button>
				</DropdownButton>
				<DropdownContent>
					<span className={clsx(styles['p-material-request-detail__evalutator-dropdown__title'])}>
						{tText('Aanvraag beoordelen descriptive title')}
					</span>
					<span
						className={clsx(styles['p-material-request-detail__evalutator-dropdown__description'])}
					>
						{tText('Kies voor de gewenste optie om de aanvraag te beoordelen.')}
					</span>
					{!requestHasAdditionalConditionsAsked &&
						renderEvaluatorButton(
							'approve',
							IconNamesLight.Check,
							tText('Goedkeuren knop label'),
							tText('Goedkeuren knop beschrijving'),
							false,
							onApproveRequest
						)}
					{renderEvaluatorButton(
						'additional-conditions',
						IconNamesLight.Check,
						tText('Goedkeuren mit voorwaarden knop label'),
						tText('Goedkeuren mit voorwaarden knop beschrijving'),
						requestHasAdditionalConditionsAsked
						// TODO: add logic to request additional conditions
					)}
					{renderEvaluatorButton(
						'deny',
						IconNamesLight.Times,
						tText('Afkeuren knop label'),
						tText('Afkeuren knop beschrijving'),
						false,
						onDeclineRequest
					)}
				</DropdownContent>
			</Dropdown>
		);
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
						<div className={clsx(styles['p-material-request-detail__action-bar'])}>
							<Tabs
								className={clsx(styles['p-material-request-detail__tabs'])}
								tabs={tabs}
								onClick={(tabId) => setActiveTab(tabId as MaterialRequestDetailBladeTabs)}
							/>
							{renderCTA()}
						</div>
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
