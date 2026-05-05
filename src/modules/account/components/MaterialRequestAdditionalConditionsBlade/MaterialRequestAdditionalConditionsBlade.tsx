import type { MaterialRequestMessageBodyAdditionalConditions } from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { CheckboxAccordion } from '@shared/components/CheckboxAccordion';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';
import { BladeStepSubtitle } from '../BladeStepSubtitle/BladeStepSubtitle';
import { MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_OPTIONS } from './MaterialRequestAdditionalConditionsBlade.const';
import styles from './MaterialRequestAdditionalConditionsBlade.module.scss';

interface MaterialRequestAdditionalConditionsBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (conditions: MaterialRequestMessageBodyAdditionalConditions | null) => void;
	initialConditions: MaterialRequestMessageBodyAdditionalConditions | null;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestAdditionalConditionsBlade: FC<
	MaterialRequestAdditionalConditionsBladeProps
> = ({ isOpen, onClose, onSubmit, initialConditions, layer, currentLayer }) => {
	const [conditions, setConditions] =
		useState<MaterialRequestMessageBodyAdditionalConditions | null>(null);
	const [showValidation, setShowValidation] = useState(false);
	const hasNoConditions = !conditions?.conditions || conditions.conditions.length === 0;

	useEffect(() => {
		if (isOpen) {
			// Initialize from initialConditions if they exist (coming back from step 2)
			setConditions(initialConditions);
			// Reset validation
			setShowValidation(false);
		}
	}, [isOpen, initialConditions]);

	const handleSubmit = () => {
		// Validate that at least one condition is selected
		if (hasNoConditions) {
			setShowValidation(true);
			return;
		}

		// Validate that all checked conditions have text
		const hasInvalidCondition = conditions.conditions.some((c) => !c.text || c.text.trim() === '');

		if (hasInvalidCondition) {
			setShowValidation(true);
			return;
		}

		onSubmit(conditions);
	};

	const handleCancel = () => {
		onClose();
		setConditions(null);
		setShowValidation(false);
	};

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('Naar volgende stap'),
				mobileLabel: tText('Naar volgende stap - mobile'),
				type: 'primary',
				onClick: handleSubmit,
			},
			{
				label: tText('Annuleer'),
				mobileLabel: tText('Annuleer - mobile'),
				type: 'secondary',
				onClick: handleCancel,
			},
		];
	};

	return (
		<Blade
			id="material-request-additional-conditions-blade"
			isOpen={isOpen}
			layer={layer}
			currentLayer={currentLayer}
			onClose={onClose}
			isBladeInvalid={showValidation}
			title={tText('Bijkomende voorwaarden')}
			ariaLabel={tText('Bijkomende voorwaarden - aria label')}
			stickySubtitle={<BladeStepSubtitle label={tText('Stap 1 van 2')} />}
			footerButtons={getFooterButtons()}
		>
			<p>
				{tText(
					'Selecteer en beschrijf welke bijkomende voorwaarden je wil opleggen. Je voorstel wordt naar de aanvrager gestuurd, die de bijkomende voorwaarden kan nalezen en accepteren.'
				)}
			</p>

			<CheckboxAccordion
				prefix="material-request-additional-conditions"
				title={tText('Voorwaarden')}
				options={MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_OPTIONS()}
				selectedOptions={conditions?.conditions || []}
				onChange={(conditionsArray) => {
					setConditions(
						conditionsArray.length > 0
							? {
									conditions: conditionsArray,
									autoApproveAfterAcceptAdditionalConditions:
										conditions?.autoApproveAfterAcceptAdditionalConditions ?? false,
								}
							: null
					);
				}}
				showValidation={showValidation}
			/>

			{showValidation && hasNoConditions && (
				<div className={clsx(styles['c-material-request-additional-conditions-blade__validation'])}>
					<RedFormWarning error={tText('Selecteer minstens 1 voorwaarde')} />
				</div>
			)}
		</Blade>
	);
};
