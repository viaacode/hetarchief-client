import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import styles from './ListNavigation.module.scss';
import { ListNavigationItem, ListNavigationProps } from './ListNavigation.types';

const ListNavigation: FC<ListNavigationProps> = ({
	listItems,
	className,
	color = 'white',
	onClick,
}) => {
	const nodeProps = {
		buttonClassName: styles['c-list-navigation__button'],
		linkClassName: styles['c-list-navigation__link'],
	};

	const renderChildrenRecursively = (items: ListNavigationItem[], layer = 0): ReactNode => {
		return (
			<ul className={clsx(styles['c-list-navigation__list'])}>
				{items.map((item) => {
					return (
						<li key={`list-nav-item-${item.id}`} onClick={() => onClick?.(item.id)}>
							{item.hasDivider && (
								<div className={styles['c-list-navigation__divider']} />
							)}
							<div
								className={clsx(
									styles['c-list-navigation__item'],
									item.active && styles['c-list-navigation__item--active']
								)}
							>
								<div style={{ paddingLeft: `${layer * 3.2}rem` }}>
									{typeof item.node === 'function'
										? item.node(nodeProps)
										: item.node}
								</div>
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
				styles[`c-list-navigation--${color}`]
			)}
		>
			{renderChildrenRecursively(listItems)}
		</div>
	);
};

export default ListNavigation;
