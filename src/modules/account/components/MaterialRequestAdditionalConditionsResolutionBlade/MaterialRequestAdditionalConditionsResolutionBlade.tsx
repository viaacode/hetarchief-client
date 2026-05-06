import { MaterialRequestsService } from '@material-requests/services';
import type {
	MaterialRequest,
	MaterialRequestMessageBodyAdditionalConditions,
} from '@material-requests/types';
import { RadioButton } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import clsx from 'clsx';
import { isNil } from 'lodash';
import { type FC, useEffect, useState } from 'react';
import { BladeStepSubtitle } from '../BladeStepSubtitle/BladeStepSubtitle';
import styles from './MaterialRequestAdditionalConditionsResolutionBlade.module.scss';

interface MaterialRequestAdditionalConditionsResolutionBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onBack: () => void;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	conditions: MaterialRequestMessageBodyAdditionalConditions | null;
	onConditionsChange: (conditions: MaterialRequestMessageBodyAdditionalConditions | null) => void;
	onSuccess: () => void;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestAdditionalConditionsResolutionBlade: FC<
	MaterialRequestAdditionalConditionsResolutionBladeProps
> = ({
	isOpen,
	onClose,
	onBack,
	conditions,
	onConditionsChange,
	onSuccess,
	currentMaterialRequestDetail,
	layer,
	currentLayer,
}) => {
	const [showValidation, setShowValidation] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			// Reset validation when blade opens
			setShowValidation(false);
		}
	}, [isOpen]);

	const handleSubmitConditions = async () => {
		if (!currentMaterialRequestDetail?.id || !conditions) {
			return;
		}

		// Validate that a radio option is selected
		if (conditions.autoApproveAfterAcceptAdditionalConditions === null) {
			setShowValidation(true);
			return;
		}

		try {
			setIsSubmitting(true);
			await MaterialRequestsService.addAdditionalConditions(
				currentMaterialRequestDetail.id,
				conditions
			);

			toastService.notify({
				maxLines: 3,
				title: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___bijkomende-voorwaarden-opgelegd'
				),
				description: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___de-bijkomende-voorwaarden-zijn-succesvol-opgelegd'
				),
			});

			onSuccess();
		} catch (_err) {
			toastService.notify({
				maxLines: 3,
				title: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___er-ging-iets-mis'
				),
				description: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___er-ging-iets-mis-tijdens-het-opleggen-van-de-bijkomende-voorwaarden'
				),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___bijkomende-voorwaarden-opleggen'
				),
				mobileLabel: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___bijkomende-voorwaarden-opleggen-mobile'
				),
				type: 'primary',
				onClick: handleSubmitConditions,
				disabled: isSubmitting,
			},
			{
				label: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___keer-terug'
				),
				mobileLabel: tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___keer-terug-mobile'
				),
				type: 'secondary',
				disabled: isSubmitting,
				onClick: onBack,
			},
		];
	};

	return (
		<Blade
			id="material-request-additional-conditions-resolution-blade"
			isOpen={isOpen}
			layer={layer}
			currentLayer={currentLayer}
			onClose={onClose}
			isBladeInvalid={showValidation}
			title={tText(
				'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___bijkomende-voorwaarden'
			)}
			ariaLabel={tText(
				'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___bijkomende-voorwaarden-aria-label'
			)}
			stickySubtitle={
				<BladeStepSubtitle
					label={tText(
						'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___stap-2-van-2'
					)}
				/>
			}
			footerButtons={getFooterButtons()}
		>
			<p
				className={styles['c-material-request-additional-conditions-resolution-blade__description']}
			>
				{tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___duid-het-gewenst-verloop-aan-na-het-doorsturen-van-het-voorstel-met-bijkomende-voorwaarden-wanneer-de-aanvrager-de-voorwaarden-aanvaardt-wil-ik-dat'
				)}
			</p>

			<RadioButton
				className={clsx(styles['c-material-request-additional-conditions-resolution-blade__radio'])}
				label={tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___de-aanvraag-automatisch-wordt-goedgekeurd'
				)}
				aria-label={tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___de-aanvraag-automatisch-wordt-goedgekeurd-aria-label'
				)}
				checked={conditions?.autoApproveAfterAcceptAdditionalConditions === true}
				onClick={() => {
					if (conditions) {
						onConditionsChange({
							...conditions,
							autoApproveAfterAcceptAdditionalConditions: true,
						});
					}
				}}
			/>

			<p
				className={
					styles['c-material-request-additional-conditions-resolution-blade__radio-subtext']
				}
			>
				{tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___in-dit-geval-zal-het-materiaal-onmiddelijk-klaargemaakt-worden-voor-download'
				)}
			</p>

			<RadioButton
				className={clsx(styles['c-material-request-additional-conditions-resolution-blade__radio'])}
				label={tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___de-aanvraag-automatisch-wordt-afgekeurd'
				)}
				checked={conditions?.autoApproveAfterAcceptAdditionalConditions === false}
				onClick={() => {
					if (conditions) {
						onConditionsChange({
							...conditions,
							autoApproveAfterAcceptAdditionalConditions: false,
						});
					}
				}}
			/>

			<p
				className={clsx(
					styles['c-material-request-additional-conditions-resolution-blade__radio-subtext']
				)}
			>
				{tText(
					'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___in-dit-geval-zal-je-eerst-nog-manueel-de-finale-goedkeuring-moeten-geven-vooraleer-het-materiaal-klaargemaakt-wordt-voor-download'
				)}
			</p>

			{showValidation && isNil(conditions?.autoApproveAfterAcceptAdditionalConditions) && (
				<RedFormWarning
					error={tText(
						'modules/account/components/material-request-additional-conditions-resolution-blade/material-request-additional-conditions-resolution-blade___selecteer-een-van-de-opties'
					)}
				/>
			)}
		</Blade>
	);
};
