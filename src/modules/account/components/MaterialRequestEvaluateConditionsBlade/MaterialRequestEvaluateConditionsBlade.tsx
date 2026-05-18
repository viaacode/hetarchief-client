import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_ADDITIONAL_CONDITIONS_TYPE } from '@material-requests/const';
import { useEvaluateExtraConditions } from '@material-requests/hooks/evaluate-extra-conditions';
import type {
	MaterialRequestMessage,
	MaterialRequestMessageBodyAdditionalConditions,
} from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { type FC, useState } from 'react';
import styles from './MaterialRequestEvaluateConditionsBlade.module.scss';

interface MaterialRequestEvaluateConditionsBladeProps {
	isOpen: boolean;
	onClose: () => void;
	message: MaterialRequestMessage;
	layer: number;
	currentLayer: number;
	materialRequestId: string | undefined;
	onSuccess: () => void;
}

export const MaterialRequestEvaluateConditionsBlade: FC<
	MaterialRequestEvaluateConditionsBladeProps
> = ({ isOpen, onClose, message, layer, currentLayer, materialRequestId, onSuccess }) => {
	const conditionLabels = GET_MATERIAL_REQUEST_TRANSLATIONS_BY_ADDITIONAL_CONDITIONS_TYPE();
	const conditions = (message.body as MaterialRequestMessageBodyAdditionalConditions)?.conditions;
	const [showDeclineConfirmModal, setShowDeclineConfirmModal] = useState(false);

	const { mutateAsync: evaluateExtraConditions, isPending: isSubmitting } =
		useEvaluateExtraConditions();

	const handleAccept = async () => {
		if (!materialRequestId) {
			return;
		}

		try {
			await evaluateExtraConditions({ materialRequestId, action: 'accept' });

			toastService.notify({
				maxLines: 3,
				title: tText('Voorwaarden geaccepteerd'),
				description: tText('De bijkomende voorwaarden zijn geaccepteerd.'),
			});

			onSuccess();
		} catch (err) {
			console.error({
				message: 'Failed to accept extra conditions',
				error: err,
			});
			toastService.notify({
				maxLines: 3,
				title: tText('Er ging iets mis'),
				description: tText('Er ging iets mis bij het accepteren van de voorwaarden.'),
			});
		}
	};

	const handleDeclineClick = () => {
		setShowDeclineConfirmModal(true);
	};

	const handleDeclineConfirm = async () => {
		if (!materialRequestId) {
			return;
		}

		try {
			await evaluateExtraConditions({ materialRequestId, action: 'decline' });

			toastService.notify({
				maxLines: 3,
				title: tText('Aanvraag geannuleerd'),
				description: tText('De aanvraag is geannuleerd.'),
			});

			setShowDeclineConfirmModal(false);
			onClose();
			onSuccess();
		} catch (err) {
			console.error({
				message: 'Failed to decline extra conditions',
				error: err,
			});
			toastService.notify({
				maxLines: 3,
				title: tText('Er ging iets mis'),
				description: tText('Er ging iets mis bij het annuleren van de aanvraag.'),
			});
		}
	};

	const handleDeclineCancel = () => {
		setShowDeclineConfirmModal(false);
	};

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('Voorwaarden accepteren'),
				mobileLabel: tText('Voorwaarden accepteren - mobile'),
				type: 'primary',
				onClick: handleAccept,
				disabled: isSubmitting,
			},
			{
				label: tText('Aanvraag annuleren'),
				mobileLabel: tText('Aanvraag annuleren - mobile'),
				type: 'secondary',
				onClick: handleDeclineClick,
				disabled: isSubmitting,
			},
		];
	};

	return (
		<>
			<Blade
				id="material-request-evaluate-conditions-blade"
				isOpen={isOpen}
				layer={layer}
				currentLayer={currentLayer}
				onClose={onClose}
				isManaged
				title={tText(
					'modules/account/components/material-request-evaluate-conditions-blade/material-request-evaluate-conditions-blade___bijkomende-voorwaarden-evalueren'
				)}
				ariaLabel={tText(
					'modules/account/components/material-request-evaluate-conditions-blade/material-request-evaluate-conditions-blade___bijkomende-voorwaarden-evalueren'
				)}
				footerButtons={getFooterButtons()}
			>
				<p className={styles['c-material-request-evaluate-conditions-blade__description']}>
					{tText(
						'De aanbieder legt de volgende bijkomende gebruiksvoorwaarden op vooraleer de aanvraag kan goedgekeurd worden deze komen bovenop de voorwaarden die zijn ingevuld in het originele hergebruikformulier'
					)}
				</p>

				<div className={styles['c-material-request-evaluate-conditions-blade__conditions']}>
					{conditions?.map((condition) => (
						<div
							key={`evaluate-condition__${condition.type}`}
							className={styles['c-material-request-evaluate-conditions-blade__condition']}
						>
							<strong
								className={styles['c-material-request-evaluate-conditions-blade__condition-title']}
							>
								{conditionLabels[condition.type]}
							</strong>
							<div
								className={styles['c-material-request-evaluate-conditions-blade__condition-text']}
							>
								{condition.text}
							</div>
						</div>
					))}
				</div>
			</Blade>

			<ConfirmationModal
				isOpen={showDeclineConfirmModal}
				onClose={handleDeclineCancel}
				onConfirm={handleDeclineConfirm}
				onCancel={handleDeclineCancel}
				text={{
					title: tText('Aanvraag annuleren?'),
					description: tText(
						'Ben je zeker dat je deze aanvraag wilt annuleren? Deze actie kan niet ongedaan gemaakt worden.'
					),
					yes: tText('Ja, annuleer aanvraag'),
					no: tText('Nee, keer terug'),
				}}
			/>
		</>
	);
};
