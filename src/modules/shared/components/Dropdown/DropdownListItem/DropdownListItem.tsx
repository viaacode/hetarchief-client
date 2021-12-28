import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../../Icon';

import styles from './DropdownListItem.module.scss';
import { DropdownListItemProps } from './DropdownListItem.types';

const DropdownList: FC<DropdownListItemProps> = ({ className, icon, label, onClick }) => {
	const rootCls = clsx(className, styles['c-dropdown-list-item']);

	return (
		<li className={rootCls} onClick={onClick} role="button" tabIndex={0}>
			<Icon name={icon.name} className={styles['c-dropdown-list-item__icon']} />
			<span className={styles['c-dropdown-list-item__label']}>{label}</span>
		</li>
	);
};

export default DropdownList;
