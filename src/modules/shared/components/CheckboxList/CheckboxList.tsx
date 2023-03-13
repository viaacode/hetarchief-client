import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import styles from './CheckboxList.module.scss';
import { CheckboxListProps } from './CheckboxList.types';

const CheckboxList: FC<CheckboxListProps<unknown>> = ({
	items,
	className,
	itemClassName,
	checkIcon = null,
	onItemClick,
}) => {
	return (
		<ul className={clsx(className, styles['c-checkbox-list'])}>
			{items.map((item, i) => {
				const value = item.value;
				const isChecked = !!item.checked;

				return (
					<li
						key={`c-checkbox-list--${i}--${value}`}
						className={clsx(styles['c-checkbox-list__item'], itemClassName, {
							['is-checked']: isChecked,
						})}
						tabIndex={0}
						onKeyDown={(e) =>
							onKey(e, [...keysEnter, ...keysSpacebar], () => {
								if (keysSpacebar.includes(e.key)) {
									e.preventDefault();
								}

								onItemClick(isChecked, value);
							})
						}
						onClick={() => onItemClick(isChecked, value)}
					>
						<Checkbox checked={isChecked} tabIndex={-1} checkIcon={checkIcon} />
						<span>{item.label}</span>
					</li>
				);
			})}
		</ul>
	);
};

export default CheckboxList;
