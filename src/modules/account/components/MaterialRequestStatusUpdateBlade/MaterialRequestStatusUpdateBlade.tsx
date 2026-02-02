import { MaterialRequestsService } from '@material-requests/services';
import { type MaterialRequestDetail, MaterialRequestStatus } from '@material-requests/types';
import { FormControl, TextArea } from '@meemoo/react-components';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { BladeNew } from '@shared/components/Blade/Blade_new';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import React, { type FC, useEffect, useState } from 'react';

import styles from './MaterialRequestStatusUpdateBlade.module.scss';

interface MaterialRequestStatusUpdateBladeProps {
	isOpen: boolean;
	onClose: () => void;
	status?: MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED;
	currentMaterialRequestDetail: MaterialRequestDetail;
	afterStatusChanged: () => void;
	layer: number;
	currentLayer: number;
}

const MaterialRequestStatusUpdateBlade: FC<MaterialRequestStatusUpdateBladeProps> = ({
	isOpen,
	onClose,
	status,
	currentMaterialRequestDetail,
	afterStatusChanged,
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
	const MAX_MOTIVATION_LENGTH = 300;

	const [motivationInputValue, setMotivationInputValue] = useState('');

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			setMotivationInputValue('');
		}
	}, [isOpen]);

	const onCloseModal = () => {
		onClose();
		setMotivationInputValue('');
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
			afterStatusChanged();
			onCloseModal();
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

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label:
					status === MaterialRequestStatus.APPROVED
						? tText(
								'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-goedkeuren'
							)
						: tText(
								'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-afkeuren'
							),
				type: 'primary',
				onClick: onApproveOrDeny,
			},
			{
				label: tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
				),
				type: 'secondary',
				onClick: onCloseModal,
			},
		];
	};

	return (
		<BladeNew
			id="material-request-status-update-blade"
			className={styles['c-request-material-status-update']}
			isOpen={isOpen}
			layer={layer}
			currentLayer={currentLayer}
			onClose={() => onCloseModal()}
			isManaged
			title={tText(
				'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag'
			)}
			stickySubtitle={<MaterialRequestInformation />}
			subtitle={
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
			}
			footerButtons={getFooterButtons()}
		>
			<div className={styles['c-request-material-status-update__content']}>
				<dl>
					<dt className={styles['c-request-material-status-update__content-label']}>
						<label htmlFor="motivation-input">
							{status === MaterialRequestStatus.APPROVED
								? tText(
										'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-goedkeuren'
									)
								: tText(
										'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-afkeuren'
									)}
						</label>
					</dt>
					<dd className={styles['c-request-material-status-update__content-value']}>
						<FormControl
							errors={[
								<div className="u-flex" key={`form-error--motivation`}>
									<span
										className={styles['c-request-material-status-update__content-value-length']}
									>
										{motivationInputValue?.length || 0} / {MAX_MOTIVATION_LENGTH}
									</span>
								</div>,
							]}
						>
							<TextArea
								id="motivation-input"
								className={styles['c-request-material-status-update__motivation-input']}
								maxLength={MAX_MOTIVATION_LENGTH}
								onChange={(e) => setMotivationInputValue(e.target.value)}
								value={motivationInputValue}
							/>
						</FormControl>
					</dd>
				</dl>
			</div>
		</BladeNew>
	);
};

export default MaterialRequestStatusUpdateBlade;
