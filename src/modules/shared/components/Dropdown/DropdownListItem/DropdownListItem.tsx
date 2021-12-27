import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../../Icon';

import styles from './DropdownListItem.module.scss';
import { DropdownListItemProps } from './DropdownListItem.types';

const DropdownList: FC<DropdownListItemProps> = ({ className, item }) => {
	const rootCls = clsx(className, styles['c-dropdown-list-item']);

	return (
		<li key={item.label} className={rootCls}>
			<Icon name={item.icon.name} className={styles['c-dropdown-list-item__icon']} />
			<button className={styles['c-dropdown-list-item__button']} onClick={item.onClick}>
				{item.label}
			</button>
		</li>
	);
};

export default DropdownList;
