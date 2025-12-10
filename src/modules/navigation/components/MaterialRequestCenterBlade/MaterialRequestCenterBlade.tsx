import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import { useGetPendingMaterialRequests } from '@material-requests/hooks/get-pending-material-requests';
import { MaterialRequestsService } from '@material-requests/services';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestType,
} from '@material-requests/types';
import { Button, type OrderDirection } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { BladeManager } from '@shared/components/BladeManager';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { setMaterialRequestCount } from '@shared/store/ui';
import { MaterialRequestBlade } from '@visitor-space/components/MaterialRequestBlade/MaterialRequestBlade';
import { MaterialRequestForReuseBlade } from '@visitor-space/components/MaterialRequestForReuseBlade/MaterialRequestForReuseBlade';
import clsx from 'clsx';
import Link from 'next/link';
import { type FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import bladeStyles from '../../../shared/components/Blade/Blade.module.scss';
import MaterialCard from '../../../visitor-space/components/MaterialCard/MaterialCard';
import styles from './MaterialRequestCenterBlade.module.scss';

export enum MaterialRequestBladeId {
	Overview = 'overview',
	EditMaterialRequest = 'edit-material-request',
	EditMaterialRequestReuseForm = 'edit-material-request-reuse-form',
}

interface MaterialRequestCenterBladeProps {
	isOpen: boolean;
	onClose: () => void;
}

const MaterialRequestCenterBlade: FC<MaterialRequestCenterBladeProps> = ({ isOpen, onClose }) => {
	const dispatch = useDispatch();
	const locale = useLocale();

	const [selectedMaterialRequest, setSelectedMaterialRequest] = useState<MaterialRequest | null>(
		null
	);
	const [activeBlade, setActiveBlade] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_BLADE,
		withDefault(StringParam, undefined)
	);
	const [materialRequestToDelete, setMaterialRequestToDelete] = useState<MaterialRequest | null>(
		null
	);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	const getCurrentLayer = () => {
		if (!isOpen) {
			return 0;
		}
		switch (activeBlade) {
			case MaterialRequestBladeId.Overview:
				return 1;

			case MaterialRequestBladeId.EditMaterialRequest:
				return 2;

			case MaterialRequestBladeId.EditMaterialRequestReuseForm:
				return 3;

			default:
				return 0;
		}
	};

	const user = useSelector(selectUser);

	// Never fetch material requests for kiosk visitors
	const shouldFetchMaterialRequests = !!user && user.groupName !== GroupName.KIOSK_VISITOR;

	const {
		data: materialRequestsResponse,
		isFetching,
		refetch: refetchMaterialRequests,
	} = useGetPendingMaterialRequests(
		{
			orderProp: MaterialRequestKeys.createdAt,
			orderDirection: 'desc' as OrderDirection,
		},
		{ enabled: shouldFetchMaterialRequests }
	);
	const materialRequests = materialRequestsResponse?.items as MaterialRequest[];

	const noContent = !materialRequests || materialRequests?.length === 0;

	useEffect(() => {
		materialRequests && dispatch(setMaterialRequestCount(materialRequests.length));
	}, [materialRequests, dispatch]);

	useEffect(() => {
		// If the center is not open but the active blade is one of its sub-blades, we clear the active blade
		if (
			!isOpen &&
			activeBlade &&
			Object.values(MaterialRequestBladeId).includes(activeBlade as MaterialRequestBladeId)
		) {
			setActiveBlade(undefined);
		}
	}, [isOpen, activeBlade, setActiveBlade]);

	useEffect(() => {
		if (isOpen) {
			setActiveBlade(MaterialRequestBladeId.Overview);
			void refetchMaterialRequests();
		}
	}, [isOpen, setActiveBlade, refetchMaterialRequests]);

	const onCloseBlades = () => {
		setActiveBlade(undefined);
		onClose();
	};

	const deleteMaterialRequest = async (materialRequest: MaterialRequest) => {
		setMaterialRequestToDelete(materialRequest);
		if (materialRequest.type === MaterialRequestType.REUSE && materialRequest.reuseForm) {
			setShowConfirmDelete(true);
			return;
		}

		await doDeleteMaterialRequest(materialRequest.id);
	};

	const doDeleteMaterialRequest = async (id: string) => {
		setShowConfirmDelete(false);
		const deleteResponse = await MaterialRequestsService.delete(id);
		deleteResponse && (await refetchMaterialRequests());
		setMaterialRequestToDelete(null);
	};

	const cancelDeleteMaterialRequest = async () => {
		setShowConfirmDelete(false);
		setMaterialRequestToDelete(null);
	};

	const renderTitle = (props: Pick<HTMLElement, 'id' | 'className'>) => {
		return (
			<div className={styles['c-material-request-center-blade__title-container']}>
				<h2 {...props} style={{ paddingBottom: 0 }}>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraaglijst'
					)}
					{materialRequests?.length > 0 && ` (${materialRequests.length})`}
				</h2>
				<MaterialRequestInformation />
				<p className={styles['c-material-request-center-blade__more-info']}>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___vraag-dit-materiaal-rechtstreeks-aan-bij-de-aanbieder-s'
					)}
				</p>
			</div>
		);
	};

	const renderMaterialRequest = (materialRequest: MaterialRequest) => {
		return (
			<div
				key={materialRequest.id}
				className={styles['c-material-request-center-blade__material-container']}
			>
				<div className={styles['c-material-request-center-blade__material']}>
					<MaterialCard
						className={styles['c-material-request-center-blade__material-label']}
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
					>
						<p className={clsx('u-font-size-14')}>
							{tText(
								'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraag-tot',
								{
									requestType: GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[materialRequest.type],
								}
							)}
						</p>
					</MaterialCard>
				</div>
				<div className={styles['c-material-request-center-blade__material-actions']}>
					<Button
						key={'edit-material-request'}
						className={styles['c-material-request-center-blade__material-actions-button']}
						onClick={() => {
							setSelectedMaterialRequest(materialRequest);
							setActiveBlade(MaterialRequestBladeId.EditMaterialRequest);
						}}
						variants={['silver', 'sm']}
						name="Edit"
						icon={
							<Icon className={clsx('u-font-size-18')} name={IconNamesLight.Edit} aria-hidden />
						}
						aria-label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___pas-je-aanvraag-aan'
						)}
						tooltipText={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___pas-je-aanvraag-aan'
						)}
					/>
					<Button
						key={'delete-material-request'}
						onClick={() => deleteMaterialRequest(materialRequest)}
						variants={['silver', 'sm']}
						name="Delete"
						icon={
							<Icon className={clsx('u-font-size-18')} name={IconNamesLight.Trash} aria-hidden />
						}
						aria-label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___verwijder-materiaal-aanvraag'
						)}
						tooltipText={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___verwijder'
						)}
					/>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		if (noContent) {
			return (
				<p className={styles['c-material-request-center-blade__no-content']}>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___no-content'
					)}
				</p>
			);
		}
		return materialRequests.map((item) => renderMaterialRequest(item));
	};

	const renderFooter = () => {
		if (noContent) {
			return (
				<div className={styles['c-material-request-center-blade__close-button-container']}>
					<Button
						label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___sluit'
						)}
						variants={['block', 'text']}
						onClick={onCloseBlades}
						className={styles['c-material-request-center-blade__send-button']}
					/>
				</div>
			);
		}
		return (
			<div className={styles['c-material-request-center-blade__close-button-container']}>
				{user && (
					<Link
						passHref
						href={`/${ROUTE_PARTS_BY_LOCALE[locale].account}/${ROUTE_PARTS_BY_LOCALE[locale].myApplicationList}`}
						onClick={onCloseBlades}
						aria-label={tText('Werk je aanvraag af')}
					>
						<Button
							label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___werk-je-aanvraag-af'
						)}
							variants={['block', 'text', 'dark']}
							className={styles['c-material-request-center-blade__send-button']}
						/>
					</Link>
				)}
				<Button
					label={tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___sluit'
					)}
					variants={['block', 'text', 'light']}
					onClick={onCloseBlades}
				/>
			</div>
		);
	};

	return (
		<BladeManager
			currentLayer={getCurrentLayer()}
			onCloseBlade={(layer, currentLayer) => {
				setActiveBlade(MaterialRequestBladeId.Overview);
				// Prevent closing of the reuse modal
				if (layer === 1 && currentLayer !== 3) {
					onCloseBlades();
				}
			}}
			opacityStep={0.1}
		>
			<Blade
				className={styles['c-material-request-center-blade']}
				isOpen={isOpen}
				layer={1}
				currentLayer={getCurrentLayer()}
				renderTitle={() => null}
				footer={isOpen && renderFooter()}
				onClose={onCloseBlades}
				isManaged
				stickyFooter
				id="material-request-center-blade"
			>
				{renderTitle({
					id: 'material-requests-overview-blade-title',
					className: bladeStyles['c-blade__title'],
				})}
				{isFetching ? (
					<Loading
						className={styles['c-material-request-center-blade__loading']}
						owner="MaterialRequestCenterBlade: render material requests"
					/>
				) : (
					renderContent()
				)}
			</Blade>
			{selectedMaterialRequest && (
				<MaterialRequestBlade
					isOpen={activeBlade === MaterialRequestBladeId.EditMaterialRequest}
					onClose={(shouldTriggerReuseForm) => {
						if (shouldTriggerReuseForm) {
							setActiveBlade(MaterialRequestBladeId.EditMaterialRequestReuseForm);
						} else {
							setActiveBlade(MaterialRequestBladeId.Overview);
							setSelectedMaterialRequest(null);
						}
					}}
					materialRequest={selectedMaterialRequest}
					refetchMaterialRequests={refetchMaterialRequests}
					isEditMode
					layer={activeBlade === MaterialRequestBladeId.EditMaterialRequest ? 2 : 99}
					currentLayer={
						activeBlade === MaterialRequestBladeId.EditMaterialRequest ? getCurrentLayer() : 9999
					}
				/>
			)}
			{selectedMaterialRequest && (
				<MaterialRequestForReuseBlade
					isOpen={activeBlade === MaterialRequestBladeId.EditMaterialRequestReuseForm}
					onClose={() => {
						setSelectedMaterialRequest(null);
						setActiveBlade(MaterialRequestBladeId.Overview);
					}}
					materialRequest={selectedMaterialRequest}
					refetchMaterialRequests={refetchMaterialRequests}
					isEditMode
					layer={activeBlade === MaterialRequestBladeId.EditMaterialRequestReuseForm ? 3 : 99}
					currentLayer={
						activeBlade === MaterialRequestBladeId.EditMaterialRequestReuseForm
							? getCurrentLayer()
							: 9999
					}
				/>
			)}
			<ConfirmationModal
				text={{
					yes: tHtml(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___verwijderen'
					),
					no: tHtml(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___annuleren'
					),
					description: tHtml(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___ben-je-zeker-dat-je-deze-aanvraag-wil-verwijderen-de-informatie-in-het-hergebruikformulier-zal-hiermee-ook-verwijderd-worden'
					),
				}}
				fullWidthButtonWrapper
				isOpen={showConfirmDelete}
				onClose={cancelDeleteMaterialRequest}
				onCancel={cancelDeleteMaterialRequest}
				onConfirm={() => doDeleteMaterialRequest(materialRequestToDelete?.id as string)}
			/>
		</BladeManager>
	);
};

export default MaterialRequestCenterBlade;
