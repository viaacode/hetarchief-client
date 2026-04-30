import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { tText } from '@shared/helpers/translate';
import type { FC } from 'react';

import type { MaterialRequestAdditionalConditionsResolutionBladeProps } from './MaterialRequestAdditionalConditionsResolutionBlade.types';

export const MaterialRequestAdditionalConditionsResolutionBlade: FC<
	MaterialRequestAdditionalConditionsResolutionBladeProps
> = ({ isOpen, onClose, onBack, onSubmit, layer, currentLayer }) => {
	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('Bijkomende voorwaarden opleggen'),
				mobileLabel: tText('Bijkomende voorwaarden opleggen'),
				type: 'primary',
				onClick: onSubmit ? () => onSubmit('test') : undefined,
			},
			{
				label: tText('Keer terug'),
				mobileLabel: tText('Keer terug'),
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
			footerButtons={getFooterButtons()}
		>
			<div>
				<p>CONTENT ADDITIONAL CONDITIONS RESOLUTION</p>
			</div>
		</Blade>
	);
};
