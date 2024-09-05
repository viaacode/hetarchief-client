import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC } from 'react';

import { Icon, type IconName } from '../Icon';

import styles from './Toggle.module.scss';
import { type ToggleProps } from './Toggle.types';

const Toggle: FC<ToggleProps> = ({ className, options, onChange, bordered, dark }) => {
	const renderIcon = (name: IconName) => <Icon name={name} />;

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
						title={option.title}
						aria-label={option.title}
					/>
				);
			})}
		</div>
	);
};

export default Toggle;
