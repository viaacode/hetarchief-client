import ApplicationListSent from '@account/components/ApplicationListSent/ApplicationListSent';
import PersonalInfo from '@account/components/PersonalInfo/PersonalInfo';
import { Permission } from '@account/const';
import { createLabelValuePairMaterialRequestReuseForm } from '@account/utils/create-label-value-material-request-reuse-form';
import { formatCuePointsMaterialRequest } from '@account/utils/format-cuepoints-material-request';
import {
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE,
} from '@material-requests/const';
import { useGetPendingMaterialRequests } from '@material-requests/hooks/get-pending-material-requests';
import {
	type MaterialRequest,
	type MaterialRequestDownloadQuality,
	MaterialRequestKeys,
} from '@material-requests/types';
import type { OrderDirection } from '@meemoo/react-components';
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
import { VisitorLayout } from '@visitor-layout/index';
import clsx from 'clsx';
import { isEmpty } from 'lodash-es';
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
		orderDirection: 'desc' as OrderDirection,
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
		let materialRequestEntries = createLabelValuePairMaterialRequestReuseForm(
			materialRequest.reuseForm
		);

		if (!materialRequest.reuseForm) {
			materialRequestEntries.push({
				label: tText('Reden van aanvraag'),
				value: materialRequest.reason,
			});
		} else {
			materialRequestEntries = [
				{
					label: tText('Materiaal selectie'),
					value: formatCuePointsMaterialRequest(materialRequest.reuseForm),
				},
				{
					label: tText('Downloadkwaliteit'),
					value:
						GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY()[
							materialRequest.reuseForm.downloadQuality as MaterialRequestDownloadQuality
						],
				},
				...materialRequestEntries,
			];
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
