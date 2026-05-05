import type {
	MaterialRequest,
	MaterialRequestMessageBodyAdditionalConditions,
} from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { tText } from '@shared/helpers/translate';
import { type FC, useEffect, useState } from 'react';
import { BladeStepSubtitle } from '../BladeStepSubtitle/BladeStepSubtitle';

interface MaterialRequestAdditionalConditionsBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (conditions: MaterialRequestMessageBodyAdditionalConditions | null) => void;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestAdditionalConditionsBlade: FC<
	MaterialRequestAdditionalConditionsBladeProps
> = ({ isOpen, onClose, onSubmit, layer, currentLayer }) => {
	const [conditions, setConditions] =
		useState<MaterialRequestMessageBodyAdditionalConditions | null>(null);

	useEffect(() => {
		if (isOpen) {
			setConditions(null);
		}
	}, [isOpen]);

	const handleSubmit = () => {
		onSubmit(conditions);
		setConditions(null);
	};

	const handleCancel = () => {
		onClose();
		setConditions(null);
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
			ariaLabel={tText('Bijkomende voorwaarden - aria label')}
			stickySubtitle={<BladeStepSubtitle label={tText('Stap 1 van 2')} />}
			footerButtons={getFooterButtons()}
		>
			<div>
				<p>CONTENT ADDITIONAL CONDITIONS</p>
			</div>
		</Blade>
	);
};
