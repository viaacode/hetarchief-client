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
import { type FC, useEffect, useState } from 'react';
import { BladeStepSubtitle } from '../BladeStepSubtitle/BladeStepSubtitle';
import styles from './MaterialRequestAdditionalConditionsResolutionBlade.module.scss';

interface MaterialRequestAdditionalConditionsResolutionBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onBack: () => void;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	conditions: MaterialRequestMessageBodyAdditionalConditions | null;
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
	onSuccess,
	currentMaterialRequestDetail,
	layer,
	currentLayer,
}) => {
	const [
		autoApproveAfterAcceptAdditionalConditions,
		setAutoApproveAfterAcceptAdditionalConditions,
	] = useState<boolean | null>(null);
	const [showValidation, setShowValidation] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen && conditions) {
			console.log('Conditions received in Resolution Blade:', conditions);
			// Reset validation when blade opens
			setShowValidation(false);
		}
	}, [isOpen, conditions]);

	// Reset radio selection only when conditions are cleared (full cancellation)
	useEffect(() => {
		if (!conditions) {
			setAutoApproveAfterAcceptAdditionalConditions(null);
			setShowValidation(false);
		}
	}, [conditions]);

	const handleSubmitConditions = async () => {
		// Validate that a radio option is selected
		if (autoApproveAfterAcceptAdditionalConditions === null) {
			setShowValidation(true);
			return;
		}

		if (!currentMaterialRequestDetail?.id || !conditions) {
			return;
		}

		try {
			setIsSubmitting(true);
			await MaterialRequestsService.addAdditionalConditions(currentMaterialRequestDetail.id, {
				...conditions,
				autoApproveAfterAcceptAdditionalConditions,
			});

			toastService.notify({
				maxLines: 3,
				title: tText('bijkomende voorwaarden opgelegd'),
				description: tText('de bijkomende voorwaarden zijn succesvol opgelegd.'),
			});

			onSuccess();
		} catch (err) {
			toastService.notify({
				maxLines: 3,
				title: tText('er ging iets mis'),
				description: tText('Er ging iets mis tijdens het opleggen van de bijkomende voorwaarden.'),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('Bijkomende voorwaarden opleggen'),
				mobileLabel: tText('Bijkomende voorwaarden opleggen - mobile'),
				type: 'primary',
				onClick: handleSubmitConditions,
				disabled: isSubmitting,
			},
			{
				label: tText('Keer terug'),
				mobileLabel: tText('Keer terug - mobile'),
				type: 'secondary',
				onClick: onBack || onClose,
				disabled: isSubmitting,
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
			title={tText('Bijkomende voorwaarden')}
			ariaLabel={tText('Bijkomende voorwaarden')}
			isBladeInvalid={showValidation}
			stickySubtitle={<BladeStepSubtitle label={tText('Stap 2 van 2')} />}
			footerButtons={getFooterButtons()}
		>
			<>
				<RadioButton
					className={clsx(
						styles['c-material-request-additional-conditions-resolution-blade__radio']
					)}
					label={tText('De aanvraag automatisch wordt goedgekeurd')}
					checked={autoApproveAfterAcceptAdditionalConditions === true}
					onClick={() => setAutoApproveAfterAcceptAdditionalConditions(true)}
				/>

				<p
					className={
						styles['c-material-request-additional-conditions-resolution-blade__radio-subtext']
					}
				>
					{tText('In dit geval zal het materiaal onmiddelijk klaargemaakt worden voor download.')}
				</p>

				<RadioButton
					className={clsx(
						styles['c-material-request-additional-conditions-resolution-blade__radio']
					)}
					label={tText('De aanvraag automatisch wordt afgekeurd')}
					checked={autoApproveAfterAcceptAdditionalConditions === false}
					onClick={() => setAutoApproveAfterAcceptAdditionalConditions(false)}
				/>

				<p
					className={clsx(
						styles['c-material-request-additional-conditions-resolution-blade__radio-subtext']
					)}
				>
					{tText(
						'In dit geval zal je eerst nog manueel de finale goedkeuring moeten geven vooraleer het materiaal klaargemaakt wordt voor download.'
					)}
				</p>

				{showValidation && autoApproveAfterAcceptAdditionalConditions === null && (
					<RedFormWarning error={tText('Selecteer één van de opties')} />
				)}
			</>
		</Blade>
	);
};
