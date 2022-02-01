import clsx from 'clsx';
import { FC, Fragment, ReactNode } from 'react';

import styles from './ListNavigation.module.scss';
import { ListNavigationItem, ListNavigationProps } from './ListNavigation.types';

const ListNavigation: FC<ListNavigationProps> = ({
	listItems,
	className,
	type = 'primary',
	onClick,
}) => {
	const renderChildrenRecursively = (items: ListNavigationItem[], layer = 0): ReactNode => {
		return items.map((item) => {
			return (
				<Fragment key={`list-nav-item-${item.id}`}>
					{item.hasDivider && <div className={styles['c-list-navigation__divider']} />}
					<li
						onClick={() => onClick && onClick(item.id)}
						className={clsx(
							styles['c-list-navigation__item'],
							layer > 0 && styles[`c-list-navigation__item--${layer}`],
							item.active && styles['c-list-navigation__item--active']
						)}
					>
						{item.node}
					</li>
					{item.children && renderChildrenRecursively(item.children, layer + 1)}
				</Fragment>
			);
		});
	};

	return (
		<ul
			className={clsx(
				className,
				styles['c-list-navigation'],
				styles[`c-list-navigation--${type}`]
			)}
		>
			{renderChildrenRecursively(listItems)}
		</ul>
	);
};

export default ListNavigation;
