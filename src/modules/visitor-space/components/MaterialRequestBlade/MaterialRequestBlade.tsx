import { Button, RadioButton, TextArea } from '@meemoo/react-components';
import clsx from 'clsx';
import Image from 'next/image';
import React, { type FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestRequesterCapacity, MaterialRequestType } from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import { Icon } from '@shared/components/Icon';
import { TYPE_TO_ICON_MAP } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { renderMobileDesktop } from '@shared/helpers/renderMobileDesktop';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { setMaterialRequestCount } from '@shared/store/ui';
import { type IeObjectType } from '@shared/types/ie-objects';

import styles from './MaterialRequestBlade.module.scss';

interface MaterialRequestBladeProps {
	isOpen: boolean;
	isEditMode?: boolean;
	onClose: () => void;
	objectName: string;
	objectId: string;
	objectDctermsFormat: IeObjectType;
	maintainerName: string;
	maintainerLogo: string | null;
	maintainerSlug: string;
	materialRequestId?: string;
	reason?: string;
	refetchMaterialRequests?: () => void;
	type?: MaterialRequestType;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestBlade: FC<MaterialRequestBladeProps> = ({
	isOpen,
	isEditMode = false,
	onClose,
	objectName,
	objectId,
	objectDctermsFormat,
	maintainerName,
	maintainerLogo,
	maintainerSlug,
	materialRequestId,
	type,
	reason,
	refetchMaterialRequests,
	layer,
	currentLayer,
}) => {
	const dispatch = useDispatch();
	const locale = useLocale();

	const [typeSelected, setTypeSelected] = useState<MaterialRequestType | undefined>(type);
	const [noTypeSelectedOnSave, setNoTypeSelectedOnSave] = useState(false);

	const [reasonInputValue, setReasonInputValue] = useState(reason || '');

	const onCloseModal = () => {
		onClose();
		setReasonInputValue('');
		setNoTypeSelectedOnSave(false);
		setTypeSelected(undefined);
		refetchMaterialRequests?.();
	};

	const onSuccessCreated = async () => {
		const response = await MaterialRequestsService.getAll({
			isPersonal: true,
			size: 500,
			isPending: true,
		});
		dispatch(setMaterialRequestCount(response.items.length));
	};

	const onAddToList = async () => {
		try {
			if (!typeSelected) {
				setNoTypeSelectedOnSave(true);
				return;
			}
			setNoTypeSelectedOnSave(false);
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
			await onSuccessCreated();
			onCloseModal();
		} catch (err) {
			onFailedRequest();
		}
	};

	const onEditRequest = async () => {
		if (!materialRequestId) {
			onFailedRequest();
		} else {
			try {
				if (!typeSelected) {
					setNoTypeSelectedOnSave(true);
					return;
				}
				setNoTypeSelectedOnSave(false);
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
				await onSuccessCreated();
				onCloseModal();
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

	const renderTitle = (props: any) => {
		const title = isEditMode
			? tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___pas-je-aanvraag-aan'
			  )
			: tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
			  );

		return <h2 {...props}>{title}</h2>;
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
				{/* ARC-1188: requested to hide single material request button
				<Button
					label={tText(
						'modules/visitor-space/components/material-request-blade/material-request-blade___verstuur'
					)}
					variants={['block', 'text']}
					onClick={onCloseModal}
					className={styles['c-request-material__verstuur-button']}
				/> */}
				{noTypeSelectedOnSave ? (
					<span className={styles['c-request-material__reason-error']}>
						{tText(
							'modules/visitor-space/components/material-request-blade/material-request-blade___er-staan-fouten-in-dit-formulier-corrigeer-deze-en-probeer-het-opnieuw'
						)}
					</span>
				) : null}
				{renderMobileDesktop({
					mobile: (
						<Button
							label={tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek-mobile'
							)}
							variants={['block', 'text', 'dark']}
							onClick={onAddToList}
							className={styles['c-request-material__voeg-toe-button']}
						/>
					),
					desktop: (
						<Button
							label={tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek'
							)}
							variants={['block', 'text', 'dark']}
							onClick={onAddToList}
							className={styles['c-request-material__voeg-toe-button']}
						/>
					),
				})}
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
			layer={layer}
			currentLayer={currentLayer}
			className={styles['c-request-material']}
			isManaged
			id="material-request-blade"
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
						{tHtml(
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
				href={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${maintainerSlug}/${objectId}`}
				className={styles['c-request-material__material-link']}
			>
				<div className={styles['c-request-material__material']} tabIndex={0}>
					<p className={styles['c-request-material__material-label']}>
						<Icon
							className={styles['c-request-material__material-label-icon']}
							name={TYPE_TO_ICON_MAP[objectDctermsFormat]}
						/>
						<span>{objectName}</span>
					</p>
					<p className={styles['c-request-material__material-id']}>{objectId}</p>
				</div>
			</a>
			<div className={styles['c-request-material__content']}>
				<dl>
					<>
						<dt className={styles['c-request-material__content-label']}>
							<label id="radio-group-label">
								{tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___selecteer-een-type'
								)}
							</label>
						</dt>
						<dd
							className={clsx(
								styles['c-request-material__content-value'],
								styles['c-request-material__radio-buttons-container']
							)}
						>
							<RadioButton
								aria-labelledby="radio-group-label"
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___view'
								)}
								checked={typeSelected === MaterialRequestType.VIEW}
								onClick={() => setTypeSelected(MaterialRequestType.VIEW)}
							/>
							<RadioButton
								aria-labelledby="radio-group-label"
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___reuse'
								)}
								checked={typeSelected === MaterialRequestType.REUSE}
								onClick={() => setTypeSelected(MaterialRequestType.REUSE)}
							/>
							<RadioButton
								aria-labelledby="radio-group-label"
								className={styles['c-request-material__radio-button']}
								label={tText(
									'modules/visitor-space/components/material-request-blade/material-request-blade___more-info'
								)}
								checked={typeSelected === MaterialRequestType.MORE_INFO}
								onClick={() => setTypeSelected(MaterialRequestType.MORE_INFO)}
							/>
							{noTypeSelectedOnSave ? (
								<span className="c-form-control__errors">
									{tText(
										'modules/visitor-space/components/material-request-blade/material-request-blade___type-verplicht-error'
									)}
								</span>
							) : null}
						</dd>
						<dt className={styles['c-request-material__content-label']}>
							{tText(
								'modules/visitor-space/components/material-request-blade/material-request-blade___reden-van-aanvraag'
							)}
						</dt>
						<dd className={styles['c-request-material__content-value']}>
							<TextArea
								className={styles['c-request-material__reason-input']}
								onChange={(e) => setReasonInputValue(e.target.value)}
								value={reasonInputValue}
							/>
						</dd>
					</>
				</dl>
			</div>
		</Blade>
	);
};
