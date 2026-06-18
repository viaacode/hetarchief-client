import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import clsx from 'clsx';
import type { FC } from 'react';
import styles from './MaterialRequestsArchiveCheckbox.module.scss';

type MaterialRequestsArchiveCheckboxProps = {
	label: string;
	checked: boolean;
	onToggle: () => void;
	blurOnClick?: boolean;
};

export const MaterialRequestsArchiveCheckbox: FC<MaterialRequestsArchiveCheckboxProps> = ({
	label,
	checked,
	onToggle,
}) => {
	return (
		<div className={styles['c-material-requests-archive-checkbox-wrapper']}>
			<Checkbox
				className={styles['c-material-requests-archive-checkbox-wrapper__checkbox']}
				label={label}
				checked={checked}
				checkIcon={<Icon name={IconNamesLight.Check} aria-hidden />}
				onKeyDown={(e) => {
					onKey(e, [...keysEnter, ...keysSpacebar], () => {
						if (keysSpacebar.includes(e.key)) {
							e.preventDefault();
						}
						onToggle();
					});
				}}
				onClick={(e) => {
					onToggle();
					e.currentTarget.blur();
				}}
			/>
		</div>
	);
};
