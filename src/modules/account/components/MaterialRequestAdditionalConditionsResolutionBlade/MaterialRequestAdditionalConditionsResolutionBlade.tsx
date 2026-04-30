import {
	type MaterialRequest,
	MaterialRequestAdditionalConditionsType,
	type MaterialRequestMessageBodyAdditionalConditions,
} from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { tText } from '@shared/helpers/translate';
import type { FC } from 'react';
import { BladeStepSubtitle } from '../BladeStepSubtitle/BladeStepSubtitle';

interface MaterialRequestAdditionalConditionsResolutionBladeProps {
	isOpen: boolean;
	onClose: () => void;
	onBack: () => void;
	currentMaterialRequestDetail: MaterialRequest | undefined;
	layer: number;
	currentLayer: number;
}

export const MaterialRequestAdditionalConditionsResolutionBlade: FC<
	MaterialRequestAdditionalConditionsResolutionBladeProps
> = ({ isOpen, onClose, onBack, layer, currentLayer }) => {
	const handleSubmitConditions = (conditions: MaterialRequestMessageBodyAdditionalConditions) => {
		console.log(conditions);
	};

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('Bijkomende voorwaarden opleggen'),
				mobileLabel: tText('Bijkomende voorwaarden opleggen - mobile'),
				type: 'primary',
				onClick: () =>
					handleSubmitConditions({
						conditions: [
							{
								type: MaterialRequestAdditionalConditionsType.ATTRIBUTION,
								text: 'test',
							},
						],
						autoApproveAfterAcceptAdditionalConditions: false,
					}),
			},
			{
				label: tText('Keer terug'),
				mobileLabel: tText('Keer terug - mobile'),
				type: 'secondary',
				onClick: onBack || onClose,
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
			stickySubtitle={<BladeStepSubtitle label={tText('Stap 2 van 2')} />}
			footerButtons={getFooterButtons()}
		>
			<div>
				<p>CONTENT ADDITIONAL CONDITIONS RESOLUTION</p>
			</div>
		</Blade>
	);
};
