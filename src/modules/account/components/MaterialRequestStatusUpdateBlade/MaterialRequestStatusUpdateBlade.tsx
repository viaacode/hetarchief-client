import { MaterialRequestsService } from '@material-requests/services';
import { type MaterialRequestDetail, MaterialRequestStatus } from '@material-requests/types';
import { Button, FormControl, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';

import styles from './MaterialRequestStatusUpdateBlade.module.scss';

interface MaterialRequestStatusUpdateBladeProps {
	isOpen: boolean;
	onClose: (success: boolean) => void;
	status?: MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED;
	currentMaterialRequestDetail: MaterialRequestDetail;
	refetchMaterialRequests?: () => void;
	layer: number;
	currentLayer: number;
}

const MaterialRequestStatusUpdateBlade: FC<MaterialRequestStatusUpdateBladeProps> = ({
	isOpen,
	onClose,
	status,
	currentMaterialRequestDetail,
	refetchMaterialRequests,
	layer,
	currentLayer,
}) => {
	const {
		objectSchemaName: objectName,
		objectDctermsFormat,
		objectSchemaIdentifier,
		objectRepresentationId,
		objectThumbnailUrl,
		objectPublishedOrCreatedDate,
		maintainerSlug,
		maintainerName,
	} = currentMaterialRequestDetail;
	const locale = useLocale();

	const [motivationInputValue, setMotivationInputValue] = useState('');

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			setMotivationInputValue('');
		}
	}, [isOpen]);

	const onCloseModal = (success: boolean) => {
		onClose(success);
		setMotivationInputValue('');
	};

	const onSuccessStatusUpdated = async () => {
		refetchMaterialRequests?.();
		onCloseModal(true);
	};

	const onApproveOrDeny = async () => {
		try {
			const response =
				status === MaterialRequestStatus.APPROVED
					? await MaterialRequestsService.approve(
							currentMaterialRequestDetail.id,
							motivationInputValue
						)
					: await MaterialRequestsService.deny(
							currentMaterialRequestDetail.id,
							motivationInputValue
						);
			if (response === undefined) {
				onFailedRequest();
				return;
			}
			await onSuccessStatusUpdated();
		} catch (_err) {
			onFailedRequest();
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

	const renderTitle = (props: Pick<HTMLElement, 'id' | 'className'>) => (
		<>
			<h2
				{...props}
				className={clsx(props.className, styles['c-request-material-status-update__title'])}
			>
				{tText('Aanvraag')}
			</h2>
			<MaterialRequestInformation />
		</>
	);

	const renderFooter = () => (
		<div className={styles['c-request-material-status-update__footer-container']}>
			<Button
				label={
					status === MaterialRequestStatus.APPROVED
						? tText('Aanvraag goedkeuren')
						: tText('Aanvraag afkeuren')
				}
				variants={['block', 'black']}
				onClick={onApproveOrDeny}
				className={styles['c-request-material-status-update__verstuur-button']}
			/>

			<Button
				label={tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
				)}
				variants={['block', 'text']}
				onClick={() => onCloseModal(false)}
				className={styles['c-request-material-status-update__annuleer-button']}
			/>
		</div>
	);

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={renderTitle}
			footer={isOpen && renderFooter()}
			onClose={() => onCloseModal(false)}
			layer={layer}
			currentLayer={currentLayer}
			className={styles['c-request-material-status-update']}
			isManaged
			id="material-request-status-update-blade"
		>
			<div className={styles['c-request-material-status-update__content-wrapper']}>
				<div className={styles['c-request-material-status-update__content']}>
					<MaterialCard
						openInNewTab={true}
						objectId={objectSchemaIdentifier}
						title={objectName}
						thumbnail={objectThumbnailUrl}
						hideThumbnail={true}
						orientation="vertical"
						link={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${maintainerSlug}/${objectSchemaIdentifier}`}
						type={objectDctermsFormat}
						publishedBy={maintainerName}
						publishedOrCreatedDate={objectPublishedOrCreatedDate}
						icon={getIconFromObjectType(objectDctermsFormat, !!objectRepresentationId)}
					/>
				</div>
				<div className={styles['c-request-material-status-update__content']}>
					<dl>
						<dt className={styles['c-request-material-status-update__content-label']}>
							<label htmlFor="motivation-input">
								{status === MaterialRequestStatus.APPROVED
									? tText('Aanvraag goedkeuren')
									: tText('Aanvraag afkeuren')}
							</label>
						</dt>
						<dd className={styles['c-request-material-status-update__content-value']}>
							<FormControl
								errors={[
									<div className="u-flex" key={`form-error--motivation`}>
										<span
											className={styles['c-request-material-status-update__content-value-length']}
										>
											{motivationInputValue?.length || 0} / 300
										</span>
									</div>,
								]}
							>
								<TextArea
									id="motivation-input"
									className={styles['c-request-material-status-update__motivation-input']}
									maxLength={300}
									onChange={(e) => setMotivationInputValue(e.target.value)}
									value={motivationInputValue}
								/>
							</FormControl>
						</dd>
					</dl>
				</div>
			</div>
		</Blade>
	);
};

export default MaterialRequestStatusUpdateBlade;
