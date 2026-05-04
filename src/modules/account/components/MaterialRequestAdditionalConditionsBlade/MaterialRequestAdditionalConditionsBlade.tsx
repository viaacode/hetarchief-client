import {
	type MaterialRequest,
	MaterialRequestAdditionalConditionsType,
	type MaterialRequestMessageBodyAdditionalConditions,
} from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { CheckboxAccordion } from '@shared/components/CheckboxAccordion';
import type { CheckboxAccordionOption } from '@shared/components/CheckboxAccordion/CheckboxAccordion.types';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type FC, useEffect, useMemo, useState } from 'react';
import { BladeStepSubtitle } from '../BladeStepSubtitle/BladeStepSubtitle';
import styles from './MaterialRequestAdditionalConditionsBlade.module.scss';

interface MaterialRequestAdditionalConditionsBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (conditions: MaterialRequestMessageBodyAdditionalConditions | null) => void;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	initialConditions?: MaterialRequestMessageBodyAdditionalConditions | null;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestAdditionalConditionsBlade: FC<
	MaterialRequestAdditionalConditionsBladeProps
> = ({ isOpen, onClose, onSubmit, initialConditions, layer, currentLayer }) => {
	const [conditions, setConditions] =
		useState<MaterialRequestMessageBodyAdditionalConditions | null>(null);
	const [showValidation, setShowValidation] = useState(false);

	useEffect(() => {
		if (isOpen) {
			// Initialize from initialConditions if they exist (coming back from step 2)
			setConditions(initialConditions || null);
			// Reset validation
			setShowValidation(false);
		}
	}, [isOpen, initialConditions]);

	const conditionOptions: CheckboxAccordionOption<MaterialRequestAdditionalConditionsType>[] =
		useMemo(
			() => [
				{
					label: tText('Toestemming rechthebbende'),
					value: MaterialRequestAdditionalConditionsType.PERMISSION_LICENSE_OWNER,
					description: tText(
						'Beschrijf hier welke toestemming de aanvrager moet verkrijgen van de rechthebbende.'
					),
					placeholder: tText('Beschrijf de voorwaarde...'),
					maxLength: 500,
				},
				{
					label: tText('Naamsvermelding'),
					value: MaterialRequestAdditionalConditionsType.ATTRIBUTION,
					description: tText('Beschrijf hier hoe de aanvrager de naamsvermelding moet uitvoeren.'),
					placeholder: tText('Beschrijf de voorwaarde...'),
					maxLength: 500,
				},
				{
					label: tText('Betaling'),
					value: MaterialRequestAdditionalConditionsType.PAYMENT,
					description: tText('Beschrijf hier welke betaling de aanvrager moet uitvoeren.'),
					placeholder: tText('Beschrijf de voorwaarde...'),
					maxLength: 500,
				},
				{
					label: tText('Extra gebruiksbeperking'),
					value: MaterialRequestAdditionalConditionsType.EXTRA_USE_LIMITATION,
					description: tText('Beschrijf hier welke extra gebruiksbeperkingen van toepassing zijn.'),
					placeholder: tText('Beschrijf de voorwaarde...'),
					maxLength: 500,
				},
			],
			[]
		);

	const handleSubmit = () => {
		// Validate that at least one condition is selected
		if (!conditions?.conditions || conditions.conditions.length === 0) {
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
			title={tText('Bijkomende voorwaarden')}
			ariaLabel={tText('Bijkomende voorwaarden')}
			isBladeInvalid={showValidation}
			stickySubtitle={<BladeStepSubtitle label={tText('Stap 1 van 2')} />}
			footerButtons={getFooterButtons()}
		>
			<div>
				<p>
					{tText(
						'Selecteer en beschrijf welke bijkomende voorwaarden je wil opleggen. Je voorstel wordt naar de aanvrager gestuurd, die de bijkomende voorwaarden kan nalezen en accepteren.'
					)}
				</p>

				<CheckboxAccordion
					title={tText('Voorwaarden')}
					options={conditionOptions}
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

				<div className={clsx(styles['c-material-request-additional-conditions-blade__validation'])}>
					{showValidation && (!conditions?.conditions || conditions.conditions.length === 0) && (
						<RedFormWarning error={tText('Selecteer minstens 1 voorwaarde')} />
					)}
				</div>
			</div>
		</Blade>
	);
};
