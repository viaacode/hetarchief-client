import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { Icon, IconLightNames } from '../Icon';

import styles from './Toggle.module.scss';
import { ToggleProps } from './Toggle.types';

const Toggle: FC<ToggleProps> = ({ className, options, onChange, bordered, dark }) => {
	const renderIcon = (name: IconLightNames) => <Icon name={name} />;

	return (
		<div
			className={clsx(
				className,
				styles['c-toggle'],
				bordered && styles['c-toggle--bordered'],
				dark && styles['c-toggle--dark']
			)}
		>
			{options.map((option) => {
				return (
					<Button
						className={clsx(
							styles['c-toggle__option'],
							option.active && styles['c-toggle__option--active']
						)}
						key={option.id}
						icon={renderIcon(option.iconName)}
						variants="text"
						onClick={() => onChange(option.id)}
					/>
				);
			})}
		</div>
	);
};

export default Toggle;
