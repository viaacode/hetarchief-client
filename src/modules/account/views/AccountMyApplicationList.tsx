import ApplicationListSent from '@account/components/ApplicationListSent/ApplicationListSent';
import PersonalInfo from '@account/components/PersonalInfo/PersonalInfo';
import { Permission } from '@account/const';
import {
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_COPYRIGHT,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_ACCESS,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_DIGITAL_ONLINE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_TYPE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_GEOGRAPHICAL_USAGE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_INTENDED_USAGE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_MATERIAL_EDITING,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TIME_USAGE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE,
} from '@material-requests/const';
import { useGetPendingMaterialRequests } from '@material-requests/hooks/get-pending-material-requests';
import {
	type MaterialRequest,
	type MaterialRequestCopyrightDisplay,
	type MaterialRequestDistributionAccess,
	type MaterialRequestDistributionDigitalOnline,
	type MaterialRequestDistributionType,
	type MaterialRequestDownloadQuality,
	type MaterialRequestEditing,
	type MaterialRequestGeographicalUsage,
	type MaterialRequestIntendedUsage,
	MaterialRequestKeys,
	MaterialRequestTimeUsage,
} from '@material-requests/types';
import {
	formatDurationHoursMinutesSeconds,
	formatDurationMinutesSeconds,
} from '@meemoo/react-components';
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Loading } from '@shared/components/Loading';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useAppDispatch } from '@shared/store';
import {
	setMaterialRequestCount,
	setShowFooter,
	setShowMaterialRequestCenter,
} from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { VisitorLayout } from '@visitor-layout/index';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import MaterialCard from '../../visitor-space/components/MaterialCard/MaterialCard';
import styles from './AccountMyApplicationList.module.scss';

export const AccountMyApplicationList: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	useHideFooter();
	useStickyLayout();

	const router = useRouter();
	const dispatch = useAppDispatch();

	const hasMaterialRequestsPerm = useHasAnyPermission(Permission.CREATE_MATERIAL_REQUESTS);
	const [applicationListSent, setApplicationListSent] = useState(false);

	const {
		data: materialRequestsResponse,
		isFetching,
		refetch: refetchMaterialRequests,
	} = useGetPendingMaterialRequests({
		orderProp: MaterialRequestKeys.createdAt,
		orderDirection: AvoSearchOrderDirection.DESC,
	});

	const noData = useMemo(
		(): boolean => isEmpty(materialRequestsResponse?.items),
		[materialRequestsResponse]
	);
	const materialRequests = useMemo(
		(): MaterialRequest[] => materialRequestsResponse?.items || [],
		[materialRequestsResponse]
	);

	useEffect(() => {
		materialRequests && dispatch(setMaterialRequestCount(materialRequests.length));
	}, [materialRequests, dispatch]);

	const onCancelRequest = () => {
		router.back();
		dispatch(setShowMaterialRequestCenter(true));
	};

	const onSuccessRequest = () => {
		void refetchMaterialRequests();
		setApplicationListSent(true);
		dispatch(setShowFooter(true));
	};

	const renderEmptyMessage = (): ReactNode => tHtml('Geen aanvragen te vervolledigen');

	const renderMaterialRequestEntry = (label: string, value: ReactNode | string) => {
		return (
			<dl key={label} className={styles['p-my-application-list__request-row']}>
				<dt className={styles['p-my-application-list__request-row-label']}>{label}</dt>
				<dd className={styles['p-my-application-list__request-row-value']}>{value}</dd>
			</dl>
		);
	};

	const renderMaterialRequestCardCaption = (caption: string, materialRequest: MaterialRequest) => {
		return (
			<div className={styles['p-my-application-list__request-caption']}>
				<span>{caption}</span>
				<span>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraag-tot',
						{
							requestType: GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[materialRequest.type],
						}
					)}
				</span>
			</div>
		);
	};

	const renderMaterialRequest = (materialRequest: MaterialRequest) => {
		const materialRequestEntries: {
			label: string;
			value: ReactNode | string;
		}[] = [];

		if (!materialRequest.reuseForm) {
			materialRequestEntries.push({
				label: tText('Reden van aanvraag'),
				value: materialRequest.reason,
			});
		} else {
			const formatTimeStamp = (value: number | undefined) => {
				if (isNil(value)) return '';

				if (value < 60 * 60) {
					return formatDurationMinutesSeconds(value);
				}
				return formatDurationHoursMinutesSeconds(value);
			};

			materialRequestEntries.push({
				label: tText('Materiaal selectie'),
				value: `${formatTimeStamp(materialRequest.reuseForm.startTime)} - ${formatTimeStamp(materialRequest.reuseForm.endTime)}`,
			});

			materialRequestEntries.push({
				label: tText('Downloadkwaliteit'),
				value:
					GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY()[
						materialRequest.reuseForm.downloadQuality as MaterialRequestDownloadQuality
					],
			});

			materialRequestEntries.push({
				label: tText('Bedoeld gebruik'),
				value: (
					<>
						{
							GET_MATERIAL_REQUEST_TRANSLATIONS_BY_INTENDED_USAGE()[
								materialRequest.reuseForm.intendedUsage as MaterialRequestIntendedUsage
							]
						}
						<br /> {materialRequest.reuseForm.intendedUsageDescription}
					</>
				),
			});

			materialRequestEntries.push({
				label: tText('Ontsluiting materiaal'),
				value:
					GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_ACCESS()[
						materialRequest.reuseForm.distributionAccess as MaterialRequestDistributionAccess
					],
			});

			materialRequestEntries.push({
				label: tText('Type ontsluiting'),
				value: (
					<>
						{
							GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_TYPE()[
								materialRequest.reuseForm.distributionType as MaterialRequestDistributionType
							]
						}
						{materialRequest.reuseForm.distributionTypeDigitalOnline && (
							<>
								<br />
								{
									GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_DIGITAL_ONLINE()[
										materialRequest.reuseForm
											.distributionTypeDigitalOnline as MaterialRequestDistributionDigitalOnline
									]
								}
							</>
						)}
						{materialRequest.reuseForm.distributionTypeOtherExplanation && (
							<>
								<br />
								{materialRequest.reuseForm.distributionTypeOtherExplanation}
							</>
						)}
					</>
				),
			});

			materialRequestEntries.push({
				label: tText('Wijzigingen'),
				value:
					GET_MATERIAL_REQUEST_TRANSLATIONS_BY_MATERIAL_EDITING()[
						materialRequest.reuseForm.materialEditing as MaterialRequestEditing
					],
			});

			materialRequestEntries.push({
				label: tText('Geografisch hergebruik'),
				value: (
					<>
						{
							GET_MATERIAL_REQUEST_TRANSLATIONS_BY_GEOGRAPHICAL_USAGE()[
								materialRequest.reuseForm.geographicalUsage as MaterialRequestGeographicalUsage
							]
						}
						{materialRequest.reuseForm.geographicalUsageDescription && (
							<>
								<br />
								{materialRequest.reuseForm.geographicalUsageDescription}
							</>
						)}
					</>
				),
			});

			materialRequestEntries.push({
				label: tText('Gebruik doorheen de tijd'),
				value: (
					<>
						{
							GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TIME_USAGE()[
								materialRequest.reuseForm.timeUsageType as MaterialRequestTimeUsage
							]
						}
						{materialRequest.reuseForm.timeUsageType === MaterialRequestTimeUsage.IN_TIME && (
							<>
								{': '}
								{formatMediumDate(asDate(materialRequest.reuseForm.timeUsageFrom))}
								{' - '}
								{formatMediumDate(asDate(materialRequest.reuseForm.timeUsageTo))}
							</>
						)}
					</>
				),
			});

			materialRequestEntries.push({
				label: tText('Bronvermelding'),
				value:
					GET_MATERIAL_REQUEST_TRANSLATIONS_BY_COPYRIGHT()[
						materialRequest.reuseForm.copyrightDisplay as MaterialRequestCopyrightDisplay
					],
			});
		}

		return (
			<div key={materialRequest.id} className={styles['p-my-application-list__request-container']}>
				<div className={styles['p-my-application-list__request']}>
					<MaterialCard
						className={styles['p-my-application-list__request-material-card']}
						objectId={materialRequest.objectSchemaIdentifier}
						title={materialRequest.objectSchemaName}
						orientation="vertical"
						thumbnail={materialRequest.objectThumbnailUrl}
						hideThumbnail={true}
						withBorder={false}
						link={`/zoeken/${materialRequest.maintainerSlug}/${materialRequest.objectSchemaIdentifier}`}
						type={materialRequest.objectDctermsFormat}
						publishedBy={materialRequest.maintainerName}
						publishedOrCreatedDate={materialRequest.objectPublishedOrCreatedDate}
						icon={getIconFromObjectType(materialRequest.objectDctermsFormat, true)}
						renderAdditionalCaption={(caption) =>
							renderMaterialRequestCardCaption(caption, materialRequest)
						}
					/>
				</div>
				<hr className={styles['p-my-application-list__request-divider']} />
				<div>
					{materialRequestEntries.map(({ label, value }) =>
						renderMaterialRequestEntry(label, value)
					)}
				</div>
			</div>
		);
	};

	const renderContent = (): ReactNode => {
		return (
			<div className={styles['p-my-application-list__requests-wrapper']}>
				{materialRequests.map((item) => renderMaterialRequest(item))}
			</div>
		);
	};

	const renderPageContent = () => {
		if (!hasMaterialRequestsPerm) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={null}
					description={tHtml(
						'modules/shared/components/error-no-access/error-no-access___je-hebt-geen-toegang-tot-deze-pagina'
					)}
				/>
			);
		}

		if (applicationListSent) {
			return <ApplicationListSent />;
		}

		return (
			<div className={clsx(styles['p-my-application-list'])}>
				<div>
					<header className={clsx(styles['p-my-application-list__header'], 'l-container')}>
						<h2 className={styles['p-my-application-list__page-title']}>
							{tText('Aanvraaglijst')}
							{materialRequests?.length > 0 && ` (${materialRequests.length})`}
						</h2>
					</header>
					<div
						className={clsx(
							'l-container l-container--edgeless-to-lg',
							styles['p-my-application-list__wrapper'],
							{
								'u-text-center u-color-neutral u-py-48': isFetching || noData,
							}
						)}
					>
						{isFetching && <Loading owner="Material requests overview" fullscreen />}
						{noData && renderEmptyMessage()}
						{!noData && !isFetching && renderContent()}
					</div>
				</div>
				<PersonalInfo
					mostRecentMaterialRequestName={
						materialRequests.length > 0 ? materialRequests[0].objectSchemaName : ''
					}
					hasRequests={materialRequests.length > 0}
					onCancel={onCancelRequest}
					onSuccess={onSuccessRequest}
				/>
			</div>
		);
	};
	return (
		<VisitorLayout>
			<SeoTags
				title={tText('Aanvraaglijst meta titel')}
				description={tText('Aanvraaglijst meta omschrijving')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.CREATE_MATERIAL_REQUESTS]}>
				<div className="u-bg-platinum">{renderPageContent()}</div>
			</PermissionsCheck>
		</VisitorLayout>
	);
};
