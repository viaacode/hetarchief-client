import { Checkbox, keysEnter, keysSpacebar, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import styles from './CheckboxList.module.scss';
import { CheckboxListProps } from './CheckboxList.types';

const CheckboxList: FC<CheckboxListProps<unknown>> = ({ items, className, onItemClick }) => {
	return (
		<ul className={clsx(className, styles['c-checkbox-list'])}>
			{items.map((item, i) => {
				const value = item.value;
				const isChecked = item.checked;

				return (
					<li
						key={`c-checkbox-list--${i}--${value}`}
						className={styles['c-checkbox-list__item']}
						tabIndex={0}
						onKeyDown={(e) =>
							onKey(e, [...keysEnter, ...keysSpacebar], () =>
								onItemClick(!!isChecked, value)
							)
						}
						onClick={() => onItemClick(!!isChecked, value)}
					>
						<Checkbox checked={!!isChecked} tabIndex={-1} />
						<span>{item.label}</span>
					</li>
				);
			})}
		</ul>
	);
};

export default CheckboxList;
