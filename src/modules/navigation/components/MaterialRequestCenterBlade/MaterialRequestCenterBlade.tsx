import { Button, type OrderDirection } from '@meemoo/react-components';
import Image from 'next/image';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GroupName } from '@account/const';
import { selectUser } from '@auth/store/user';
import { useGetPendingMaterialRequests } from '@material-requests/hooks/get-pending-material-requests';
import { MaterialRequestsService } from '@material-requests/services';
import { type MaterialRequest, MaterialRequestKeys } from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import { BladeManager } from '@shared/components/BladeManager';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { TYPE_TO_ICON_MAP } from '@shared/components/MediaCard';
import { tHtml, tText } from '@shared/helpers/translate';
import { setMaterialRequestCount } from '@shared/store/ui';
import { MaterialRequestBlade } from '@visitor-space/components/MaterialRequestBlade/MaterialRequestBlade';

import bladeStyles from '../../../shared/components/Blade/Blade.module.scss';
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

	const {
		data: materialRequests,
		isFetching,
		refetch: refetchMaterialRequests,
	} = useGetPendingMaterialRequests(
		{
			orderProp: MaterialRequestKeys.maintainer,
			orderDirection: 'asc' as OrderDirection,
		},
		{ enabled: !!user && user.groupName !== GroupName.KIOSK_VISITOR }
	);

	const noContent =
		!materialRequests?.items || (materialRequests?.items && materialRequests?.items.length < 1);

	// Ward: create an object containing all the distinct maintainerId's as properties
	// with per property an array of materialRequests, that has the same maintainerId as the property, as value
	const mappedRequests = useMemo(() => {
		return materialRequests?.items.reduce(
			(acc, curr) => {
				// Ward: check if maintainerId is not added yet to object
				if (!acc[curr.maintainerId]) {
					return {
						...acc,
						// Ward: add new property to object and add array, with current item, as value
						[curr.maintainerId]: [curr],
					};
				}

				return {
					...acc,
					// Ward: property already exists, so push item to array as value
					[curr.maintainerId]: [...acc[curr.maintainerId], curr],
				};
			},
			{} as { [key: string]: MaterialRequest[] }
		);
	}, [materialRequests]);

	useEffect(() => {
		materialRequests && dispatch(setMaterialRequestCount(materialRequests.items.length));
	}, [materialRequests, dispatch]);

	useEffect(() => {
		isOpen && refetchMaterialRequests();
	}, [isOpen, refetchMaterialRequests]);

	const deleteMaterialRequest = async (id: string) => {
		const deleteResponse = await MaterialRequestsService.delete(id);
		deleteResponse && (await refetchMaterialRequests());
	};

	const renderTitle = (props: any) => {
		return (
			<div className={styles['c-material-request-center-blade__title-container']}>
				<h2 {...props}>
					{tText(
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraaglijst'
					)}
				</h2>
				{/* Ward: add label when there is more than 1 maintainer */}
				{mappedRequests && Object.keys(mappedRequests).length > 1 && (
					<p className={styles['c-material-request-center-blade__subtitle']}>
						{tHtml(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___meerdere-aanbieders'
						)}
					</p>
				)}
			</div>
		);
	};

	const renderMaintainer = (item: MaterialRequest, length: number) => {
		return (
			<div className={styles['c-material-request-center-blade__maintainer']}>
				{item.maintainerLogo ? (
					<div className={styles['c-material-request-center-blade__maintainer-logo']}>
						<Image
							alt="maintainer logo"
							src={item.maintainerLogo}
							layout="fill"
							objectFit="contain"
						/>
					</div>
				) : (
					<div
						className={styles['c-material-request-center-blade__maintainer-logo']}
						style={{ color: 'black' }}
					/>
				)}

				<div>
					<p className={styles['c-material-request-center-blade__maintainer-details']}>
						{tHtml(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___aangevraagd'
						)}
					</p>
					<p className={styles['c-material-request-center-blade__maintainer-details']}>
						{item.maintainerName} ({length})
					</p>
				</div>
			</div>
		);
	};

	const renderMaterialRequest = (materialRequest: MaterialRequest) => {
		return (
			<div
				key={materialRequest.id}
				className={styles['c-material-request-center-blade__material-container']}
			>
				<a
					tabIndex={-1}
					href={`/zoeken/${materialRequest.maintainerSlug}/${materialRequest.objectSchemaIdentifier}`}
					className={styles['c-material-request-center-blade__material-link']}
				>
					<div
						className={styles['c-material-request-center-blade__material']}
						tabIndex={0}
					>
						<p className={styles['c-material-request-center-blade__material-label']}>
							<Icon
								className={
									styles['c-material-request-center-blade__material-label-icon']
								}
								name={TYPE_TO_ICON_MAP[materialRequest.objectDctermsFormat]}
							/>
							<span>{materialRequest.objectSchemaName}</span>
						</p>
						<p className={styles['c-material-request-center-blade__material-id']}>
							{materialRequest.objectSchemaIdentifier}
						</p>
					</div>
				</a>
				<div className={styles['c-material-request-center-blade__material-actions']}>
					<Button
						key={'edit-material-request'}
						className={
							styles['c-material-request-center-blade__material-actions-button']
						}
						onClick={() => {
							setSelectedMaterialRequest(materialRequest);
							setActiveBlade(MaterialRequestBladeId.EditMaterialRequest);
						}}
						variants={['silver']}
						name="Edit"
						icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
						aria-label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___pas-je-aanvraag-aan'
						)}
						tooltipText={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___pas-je-aanvraag-aan'
						)}
					/>
					<Button
						key={'delete-material-request'}
						onClick={() => deleteMaterialRequest(materialRequest.id)}
						variants={['silver']}
						name="Delete"
						icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
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
		return (
			mappedRequests &&
			// Ward: render each unique maintainer
			Object.keys(mappedRequests).map((key) => (
				<div key={key}>
					{renderMaintainer(mappedRequests[key][0], mappedRequests[key].length)}

					{/* Ward: render all materialRequests of current maintainer, sorted by objectSchemaName */}
					{mappedRequests[key]
						.sort((a, b) => a.objectSchemaName.localeCompare(b.objectSchemaName))
						.map((item) => renderMaterialRequest(item))}
				</div>
			))
		);
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
						label={tText(
							'modules/navigation/components/material-request-center-blade/material-request-center-blade___vul-gegevens-aan'
						)}
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
					objectId={selectedMaterialRequest.objectSchemaIdentifier}
					objectDctermsFormat={selectedMaterialRequest.objectDctermsFormat}
					maintainerName={selectedMaterialRequest.maintainerName}
					maintainerLogo={selectedMaterialRequest.maintainerLogo}
					maintainerSlug={selectedMaterialRequest.maintainerSlug}
					materialRequestId={selectedMaterialRequest.id}
					reason={selectedMaterialRequest.reason}
					type={selectedMaterialRequest.type}
					refetchMaterialRequests={refetchMaterialRequests}
					isEditMode
					layer={activeBlade === MaterialRequestBladeId.EditMaterialRequest ? 2 : 99}
					currentLayer={
						activeBlade === MaterialRequestBladeId.EditMaterialRequest
							? getCurrentLayer()
							: 9999
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
						activeBlade === MaterialRequestBladeId.PersonalDetails
							? getCurrentLayer()
							: 9999
					}
					refetch={refetchMaterialRequests}
				/>
			)}
		</BladeManager>
	);
};

export default MaterialRequestCenterBlade;
