import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { tText } from '@shared/helpers/translate';
import { type FC, useEffect, useState } from 'react';
import styles from './MaterialRequestAdditionalConditionsBlade.module.scss';
import type { MaterialRequestAdditionalConditionsBladeProps } from './MaterialRequestAdditionalConditionsBlade.types';

export const MaterialRequestAdditionalConditionsBlade: FC<
	MaterialRequestAdditionalConditionsBladeProps
> = ({ isOpen, onClose, onSubmit, initialConditions, layer, currentLayer }) => {
	const [conditions, setConditions] = useState(initialConditions || '');

	useEffect(() => {
		if (isOpen) {
			setConditions(initialConditions || '');
		}
	}, [isOpen, initialConditions]);

	const handleSubmit = () => {
		onSubmit(conditions);
		setConditions('');
	};

	const handleCancel = () => {
		onClose();
		setConditions('');
	};

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('Naar volgende stap'),
				mobileLabel: tText('Naar volgende stap'),
				type: 'primary',
				onClick: handleSubmit,
			},
			{
				label: tText('Annuleer'),
				mobileLabel: tText('Annuleer'),
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
			stickySubtitle={
				<span className={styles['c-request-material-additional-conditions__subtitle']}>
					{tText('Stap 1 van 2')}
				</span>
			}
			footerButtons={getFooterButtons()}
		>
			<div>
				<p>CONTENT ADDITIONAL CONDITIONS</p>
			</div>
		</Blade>
	);
};
