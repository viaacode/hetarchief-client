import { MaterialRequestsService } from '@material-requests/services';
import { type MaterialRequest, MaterialRequestStatus } from '@material-requests/types';
import { FormControl, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { MaterialRequestInformation } from '@shared/components/MaterialRequestInformation';
import { getIconFromObjectType } from '@shared/components/MediaCard';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { MaterialCard } from '@visitor-space/components/MaterialCard';
import { useIsComplexReuseFlow } from '@visitor-space/hooks/is-complex-reuse-flow';
import React, { type FC, useEffect, useState } from 'react';

import styles from './MaterialRequestStatusUpdateBlade.module.scss';

interface MaterialRequestStatusUpdateBladeProps {
	isOpen: boolean;
	onClose: (statusChanged: boolean) => void;
	status?: MaterialRequestStatus.APPROVED | MaterialRequestStatus.DENIED;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	layer: number;
	currentLayer: number;
	hasPendingAdditionalConditions?: boolean;
}

export const MaterialRequestStatusUpdateBlade: FC<MaterialRequestStatusUpdateBladeProps> = ({
	isOpen,
	onClose,
	status,
	currentMaterialRequestDetail,
	layer,
	currentLayer,
	hasPendingAdditionalConditions = false,
}) => {
	const locale = useLocale();
	const MAX_MOTIVATION_LENGTH = 300;
	const { isObjectEssenceAccessibleToUser } = useIsComplexReuseFlow(currentMaterialRequestDetail);

	const [motivationInputValue, setMotivationInputValue] = useState('');
	const [
		showDenyWithPendingConditionsConfirmationModal,
		setShowDenyWithPendingConditionsConfirmationModal,
	] = useState(false);

	/**
	 * Reset form when the model is opened
	 */
	useEffect(() => {
		if (isOpen) {
			setMotivationInputValue('');
			setShowDenyWithPendingConditionsConfirmationModal(false);
		}
	}, [isOpen]);

	if (!currentMaterialRequestDetail) {
		return null;
	}

	const {
		objectSchemaName: objectName,
		objectDctermsFormat,
		objectSchemaIdentifier,
		objectThumbnailUrl,
		objectPublishedOrCreatedDate,
		maintainerSlug,
		maintainerName,
	} = currentMaterialRequestDetail;

	const onCloseModal = (statusChanged: boolean) => {
		onClose(statusChanged);
		setMotivationInputValue('');
		setShowDenyWithPendingConditionsConfirmationModal(false);
	};

	const onApproveOrDeny = async () => {
		if (status === MaterialRequestStatus.DENIED && hasPendingAdditionalConditions) {
			setShowDenyWithPendingConditionsConfirmationModal(true);
			return;
		}

		await performApproveOrDeny();
	};

	const performApproveOrDeny = async () => {
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
			onCloseModal(true);
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

	const getFooterButtons = (): BladeFooterButtonProps => {
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
				mobileLabel:
					status === MaterialRequestStatus.APPROVED
						? tText(
								'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-goedkeuren-mobiel'
							)
						: tText(
								'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-afkeuren-mobiel'
							),
				type: 'primary',
				onClick: onApproveOrDeny,
			},
			{
				label: tText(
					'modules/visitor-space/components/material-request-blade/material-request-blade___annuleer'
				),
				mobileLabel: tText(
					'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___annuleer-mobiel'
				),
				type: 'secondary',
				onClick: () => onCloseModal(false),
			},
		];
	};

	return (
		<Blade
			id="material-request-status-update-blade"
			className={styles['c-request-material-status-update']}
			isOpen={isOpen}
			layer={layer}
			currentLayer={currentLayer}
			onClose={() => onCloseModal(false)}
			isManaged
			title={
				status === MaterialRequestStatus.APPROVED
					? tText(
							'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-goedkeuren-titel'
						)
					: tText(
							'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-afkeuren-titel'
						)
			}
			ariaLabel={tText(
				'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___materiaal-aanvraag-goedkeuren-of-afkeuren-blade-aria-label'
			)}
			stickySubtitle={<MaterialRequestInformation />}
			subtitle={
				<MaterialCard
					openInNewTab={true}
					objectSchemaIdentifier={objectSchemaIdentifier}
					title={objectName}
					thumbnail={objectThumbnailUrl}
					hideThumbnail={true}
					orientation="vertical"
					link={`/${ROUTE_PARTS_BY_LOCALE[locale].search}/${maintainerSlug}/${objectSchemaIdentifier}`}
					type={objectDctermsFormat}
					publishedBy={maintainerName}
					publishedOrCreatedDate={objectPublishedOrCreatedDate}
					icon={getIconFromObjectType(objectDctermsFormat, isObjectEssenceAccessibleToUser)}
				/>
			}
			footerButtons={getFooterButtons()}
		>
			<div className={styles['c-request-material-status-update__content']}>
				<dl>
					<dt className={styles['c-request-material-status-update__content-label']}>
						<label htmlFor="motivation-input">
							{status === MaterialRequestStatus.APPROVED
								? tHtml(
										'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-goedkeuren-description'
									)
								: tHtml(
										'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___aanvraag-afkeuren-description'
									)}
						</label>
					</dt>
					<dd className={styles['c-request-material-status-update__content-value']}>
						<FormControl
							label={
								status === MaterialRequestStatus.APPROVED
									? tText(
											'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___motivatie-aanvraag-goedkeuren'
										)
									: tText(
											'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___motivatie-aanvraag-afkeuren'
										)
							}
							errors={[
								<MaxLengthIndicator
									maxLength={MAX_MOTIVATION_LENGTH}
									value={motivationInputValue}
									key={`form-error--motivation`}
								/>,
							]}
						>
							<TextArea
								id="motivation-input"
								className={styles['c-request-material-status-update__motivation-input']}
								maxLength={MAX_MOTIVATION_LENGTH}
								onChange={(e) => setMotivationInputValue(e.target.value)}
								value={motivationInputValue}
								ariaLabel={tText(
									'modules/account/components/material-request-status-update-blade/material-request-status-update-blade___motivatie-voor-het-goedkeuren-of-afkeuren-van-de-aanvraag-input-aria-label'
								)}
							/>
						</FormControl>
					</dd>
				</dl>
			</div>

			<ConfirmationModal
				isOpen={showDenyWithPendingConditionsConfirmationModal}
				onClose={() => setShowDenyWithPendingConditionsConfirmationModal(false)}
				onConfirm={() => setShowDenyWithPendingConditionsConfirmationModal(false)}
				onCancel={() => {
					setShowDenyWithPendingConditionsConfirmationModal(false);
					performApproveOrDeny();
				}}
				fullWidthButtonWrapper
				text={{
					title: tText('Afkeuren en bijkomende gebruiksvoorwaarden verwijderen'),
					description: tText(
						'Als je de aanvraag afkeurt, worden de verzonden bijkomende gebruiksvoorwaarden verwijderd. Weet je zeker dat je wil doorgaan?'
					),
					yes: tText('Nee, keer terug en behoud bijkomende gebruiksvoorwaarden'),
					no: tText('Ja, aanvraag afkeuren en verwijder bijkomende gebruiksvoorwaarden'),
				}}
			/>
		</Blade>
	);
};
