import { Button, RadioButton, TextArea } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MaterialRequestsService } from '@material-requests/services';
import {
	MaterialRequestObjectType,
	MaterialRequestRequesterCapacity,
	MaterialRequestType,
} from '@material-requests/types';
import { Blade, Icon, IconNamesLight } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { setMaterialRequestCount } from '@shared/store/ui';

import styles from './MaterialRequestBlade.module.scss';

interface MaterialRequestBladeProps {
	isOpen: boolean;
	isEditMode?: boolean;
	onClose: () => void;
	objectName: string;
	objectId: string;
	objectType?: MaterialRequestObjectType | undefined;
	maintainerName: string;
	maintainerLogo: string;
	maintainerSlug: string;
	materialRequestId?: string;
	reason?: string;
	refetch?: () => void;
	type?: MaterialRequestType;
}

const MaterialRequestBlade: FC<MaterialRequestBladeProps> = ({
	isOpen,
	isEditMode = false,
	onClose,
	objectName,
	objectId,
	objectType,
	maintainerName,
	maintainerLogo,
	maintainerSlug,
	materialRequestId,
	reason,
	refetch,
	type,
}) => {
	const { tText } = useTranslation();
	const dispatch = useDispatch();

	const [typeSelected, setTypeSelected] = useState<MaterialRequestType>(
		type || MaterialRequestType.VIEW
	);
	const [reasonInputValue, setReasonInputValue] = useState(reason || '');
	const [showError, setShowError] = useState(false);

	const onCloseModal = () => {
		onClose();
		setReasonInputValue('');
		setTypeSelected(MaterialRequestType.VIEW);
		setShowError(false);
	};

	const onSuccesCreated = async () => {
		const response = await MaterialRequestsService.getAll({
			isPersonal: true,
			size: 500,
			isPending: true,
		});
		dispatch(setMaterialRequestCount(response.items.length));
	};

	const onAddToList = async () => {
		try {
			if (reasonInputValue.length > 0) {
				const response = await MaterialRequestsService.create({
					objectId,
					type: typeSelected,
					reason: reasonInputValue,
					requesterCapacity: MaterialRequestRequesterCapacity.OTHER,
				});
				if (response === undefined) {
					onFailedRequest();
					return;
				}
				toastService.notify({
					maxLines: 3,
					title: tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___succes'
					),
					description: tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___rond-je-aanvragenlijst-af'
					),
				});
				onSuccesCreated();
				onCloseModal();
			} else {
				setShowError(true);
			}
		} catch (err) {
			onFailedRequest();
		}
	};

	const onEditRequest = async () => {
		if (!materialRequestId) {
			onFailedRequest();
		} else {
			try {
				if (reasonInputValue.length > 0) {
					const response = await MaterialRequestsService.update(materialRequestId, {
						type: typeSelected,
						reason: reasonInputValue,
						requesterCapacity: MaterialRequestRequesterCapacity.OTHER,
					});
					if (response === undefined) {
						onFailedRequest();
						return;
					}
					toastService.notify({
						maxLines: 3,
						title: tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___wijzigingen-succes'
						),
						description: tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___wijzigingen-toegepast'
						),
					});
					onSuccesCreated();
					refetch && refetch();
					onCloseModal();
				} else {
					setShowError(true);
				}
			} catch (err) {
				onFailedRequest();
			}
		}
	};

	const onFailedRequest = () => {
		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/visitor-space/components/material-request-blade/material-request-blade___er-ging-iets-mis'
			),
			description: tText(
				'modules/visitor-space/components/material-request-blade/material-request-blade___er-ging-iets-mis-tijdens-het-opslaan'
			),
		});
	};

	const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setShowError(false);
		setReasonInputValue(e.target.value);
	};

	const renderTitle = () => {
		if (isEditMode) {
			return (
				<h4 className={styles['c-request-material__title']}>
					{tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___pas-je-aanvraag-aan'
					)}
				</h4>
			);
		}
		return (
			<h4 className={styles['c-request-material__title']}>
				{tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
				)}
			</h4>
		);
	};

	const renderFooter = () => {
		if (isEditMode) {
			return (
				<div className={styles['c-request-material__footer-container']}>
					<Button
						label={tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___wijzigingen-opslaan'
						)}
						variants={['block', 'text']}
						onClick={onEditRequest}
						className={styles['c-request-material__verstuur-button']}
					/>

					<Button
						label={tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
						)}
						variants={['block', 'text']}
						onClick={onCloseModal}
						className={styles['c-request-material__annuleer-button']}
					/>
				</div>
			);
		}
		return (
			<div className={styles['c-request-material__footer-container']}>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___verstuur'
					)}
					variants={['block', 'text']}
					onClick={onCloseModal}
					className={styles['c-request-material__verstuur-button']}
				/>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek'
					)}
					variants={['block', 'text']}
					onClick={onAddToList}
					className={styles['c-request-material__voeg-toe-button']}
				/>
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={onCloseModal}
					className={styles['c-request-material__annuleer-button']}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={renderTitle}
			footer={isOpen && renderFooter()}
			onClose={onCloseModal}
		>
			<div className={styles['c-request-material__maintainer']}>
				{maintainerLogo && (
					<div className={styles['c-request-material__maintainer-logo']}>
						<Image
							alt="maintainer logo"
							src={maintainerLogo}
							layout="fill"
							objectFit="contain"
						/>
					</div>
				)}
				<div>
					<p className={styles['c-request-material__maintainer-details']}>
						{tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___item-van'
						)}
					</p>
					<p className={styles['c-request-material__maintainer-details']}>
						{maintainerName}
					</p>
				</div>
			</div>
			<a
				tabIndex={-1}
				href={`/${ROUTE_PARTS.search}/${maintainerSlug}/${objectId}`}
				className={styles['c-request-material__material-link']}
			>
				<div className={styles['c-request-material__material']} tabIndex={0}>
					<p className={styles['c-request-material__material-label']}>
						<Icon
							className={styles['c-request-material__material-label-icon']}
							name={
								objectType === MaterialRequestObjectType.AUDIO
									? IconNamesLight.Audio
									: IconNamesLight.Video
							}
						/>
						<span>{objectName}</span>
					</p>
					<p className={styles['c-request-material__material-id']}>{objectId}</p>
				</div>
			</a>
			<div className={styles['c-request-material__content']}>
				<dl>
					<>
						<dd
							className={clsx(
								styles['c-request-material__content-value'],
								styles['c-request-material__radio-buttons-container']
							)}
						>
							<RadioButton
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___view'
								)}
								checked={typeSelected === MaterialRequestType.VIEW}
								onClick={() => setTypeSelected(MaterialRequestType.VIEW)}
							/>
							<RadioButton
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___reuse'
								)}
								checked={typeSelected === MaterialRequestType.REUSE}
								onClick={() => setTypeSelected(MaterialRequestType.REUSE)}
							/>
							<RadioButton
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___more-info'
								)}
								checked={typeSelected === MaterialRequestType.MORE_INFO}
								onClick={() => setTypeSelected(MaterialRequestType.MORE_INFO)}
							/>
						</dd>
						{showError && (
							<span className={styles['c-request-material__reason-error']}>
								{tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___reden-mag-niet-leeg-zijn'
								)}
							</span>
						)}
						<dt className={styles['c-request-material__content-label']}>
							{tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___reden-van-aanvraag'
							)}
						</dt>
						<dd className={styles['c-request-material__content-value']}>
							<TextArea
								className={styles['c-request-material__reason-input']}
								onChange={onTextAreaChange}
								value={reasonInputValue}
							/>
						</dd>
					</>
				</dl>
			</div>
		</Blade>
	);
};

export default MaterialRequestBlade;
