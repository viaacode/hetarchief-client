import clsx from 'clsx';
import { FC } from 'react';

import DropdownListItem from '../DropdownListItem/DropdownListItem';

import styles from './DropdownList.module.scss';
import { DropdownListProps } from './DropdownList.types';

const DropdownList: FC<DropdownListProps> = ({ className, listItems }) => {
	const rootCls = clsx(className, styles['c-dropdown-list']);

	return (
		<div className={rootCls}>
			{listItems.map((items, index) => {
				return (
					<ul
						key={index}
						className={clsx(
							styles['c-dropdown-list__list'],
							styles[index > 0 ? 'c-dropdown-list__list--divider' : '']
						)}
					>
						{items.map((item) => {
							return <DropdownListItem key={item.label} {...item} />;
						})}
					</ul>
				);
			})}
		</div>
	);
};

export default DropdownList;
