import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import styles from './ListNavigation.module.scss';
import { ListNavigationItem, ListNavigationProps } from './ListNavigation.types';

const ListNavigation: FC<ListNavigationProps> = ({
	listItems,
	className,
	type = 'primary',
	onClick,
}) => {
	const renderChildrenRecursively = (items: ListNavigationItem[], layer = 0): ReactNode => {
		return (
			<ul className={clsx(styles['c-list-navigation__list'])}>
				{items.map((item) => {
					return (
						<li
							key={`list-nav-item-${item.id}`}
							onClick={() => onClick && onClick(item.id)}
						>
							{item.hasDivider && (
								<div className={styles['c-list-navigation__divider']} />
							)}
							<div
								className={clsx(
									styles['c-list-navigation__item'],
									item.active && styles['c-list-navigation__item--active']
								)}
							>
								<div style={{ paddingLeft: `${layer * 3.2}rem` }}>{item.node}</div>
							</div>
							{item.children && renderChildrenRecursively(item.children, layer + 1)}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div
			className={clsx(
				className,
				styles['c-list-navigation'],
				styles[`c-list-navigation--${type}`]
			)}
		>
			{renderChildrenRecursively(listItems)}
		</div>
	);
};

export default ListNavigation;
