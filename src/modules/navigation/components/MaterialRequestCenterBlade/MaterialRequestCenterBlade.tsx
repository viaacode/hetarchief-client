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
import { tHtml, tText } from '@shared/helpers/translate';
import { setMaterialRequestCount } from '@shared/store/ui';
import { MaterialRequestBlade } from '@visitor-space/components/MaterialRequestBlade/MaterialRequestBlade';
import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import bladeStyles from '../../../shared/components/Blade/Blade.module.scss';
import MaterialCard from '../../../visitor-space/components/MaterialCard/MaterialCard';
import PersonalInfoBlade from '../PersonalInfoBlade/PersonalInfoBlade';
import styles from './MaterialRequestCenterBlade.module.scss';

export enum MaterialRequestBladeId {
	Overview = 'Overview',
	EditMaterialRequest = 'EditMaterialRequest',
	PersonalDetails = 'PersonalDetails',
}

interface MaterialRequestCenterBladeProps {
	isOpen: boolean;
	onClose: () => void;
}

const MaterialRequestCenterBlade: FC<MaterialRequestCenterBladeProps> = ({ isOpen, onClose }) => {
	const dispatch = useDispatch();

	const [selectedMaterialRequest, setSelectedMaterialRequest] = useState<MaterialRequest | null>(
		null
	);
	const [activeBlade, setActiveBlade] = useState<MaterialRequestBladeId>(
		MaterialRequestBladeId.Overview
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
			case MaterialRequestBladeId.PersonalDetails:
				return 2; // Both blades are at level 2

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
		isOpen && refetchMaterialRequests();
	}, [isOpen, refetchMaterialRequests]);

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
					{materialRequests?.length && ` (${materialRequests.length})`}
				</h2>
				<MaterialRequestInformation />
				<p className={styles['c-material-request-center-blade__more-info']}>
					{tText('Vraag dit materiaal rechtstreeks aan bij de aanbieder(s).')}
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
							{tText('Aanvraag tot', {
								requestType: GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[materialRequest.type],
							})}
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
						onClick={onClose}
						className={styles['c-material-request-center-blade__send-button']}
					/>
				</div>
			);
		}
		return (
			<div className={styles['c-material-request-center-blade__close-button-container']}>
				{user && (
					<Button
						label={tText('Werk je aanvraag af')}
						variants={['block', 'text', 'dark']}
						onClick={() => {
							setActiveBlade(MaterialRequestBladeId.PersonalDetails);
						}}
						className={styles['c-material-request-center-blade__send-button']}
					/>
				)}
				<Button
					label={tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___sluit'
					)}
					variants={['block', 'text', 'light']}
					onClick={onClose}
				/>
			</div>
		);
	};

	return (
		<BladeManager
			currentLayer={getCurrentLayer()}
			onCloseBlade={(layer) => {
				setActiveBlade(MaterialRequestBladeId.Overview);
				if (layer === 1) {
					onClose();
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
				onClose={onClose}
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
					onClose={() => {
						setActiveBlade(MaterialRequestBladeId.Overview);
						setSelectedMaterialRequest(null);
					}}
					objectName={selectedMaterialRequest.objectSchemaName}
					objectSchemaIdentifier={selectedMaterialRequest.objectSchemaIdentifier}
					objectDctermsFormat={selectedMaterialRequest.objectDctermsFormat}
					objectThumbnailUrl={selectedMaterialRequest.objectThumbnailUrl}
					objectPublishedOrCreatedDate={selectedMaterialRequest.objectPublishedOrCreatedDate}
					objectLicences={selectedMaterialRequest.objectLicences}
					objectAccessThrough={selectedMaterialRequest.objectAccessThrough}
					maintainerName={selectedMaterialRequest.maintainerName}
					maintainerSlug={selectedMaterialRequest.maintainerSlug}
					materialRequestId={selectedMaterialRequest.id}
					reason={selectedMaterialRequest.reason}
					type={selectedMaterialRequest.type}
					refetchMaterialRequests={refetchMaterialRequests}
					isEditMode
					layer={activeBlade === MaterialRequestBladeId.EditMaterialRequest ? 2 : 99}
					currentLayer={
						activeBlade === MaterialRequestBladeId.EditMaterialRequest ? getCurrentLayer() : 9999
					}
				/>
			)}
			{user && (
				<PersonalInfoBlade
					isOpen={activeBlade === MaterialRequestBladeId.PersonalDetails}
					onClose={() => {
						setActiveBlade(MaterialRequestBladeId.Overview);
					}}
					personalInfo={{
						fullName: user.fullName,
						email: user.email,
						...(user.organisationName && {
							organisation: user.organisationName,
						}),
					}}
					layer={activeBlade === MaterialRequestBladeId.PersonalDetails ? 2 : 99}
					currentLayer={
						activeBlade === MaterialRequestBladeId.PersonalDetails ? getCurrentLayer() : 9999
					}
					refetch={refetchMaterialRequests}
				/>
			)}
			<ConfirmationModal
				text={{
					yes: tHtml('Verwijderen'),
					no: tHtml('Annuleren'),
					description: tHtml(
						'Ben je zeker dat je deze aanvraag wil verwijderen? De informatie in het hergebruikformulier zal hiermee ook verwijderd worden.'
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
