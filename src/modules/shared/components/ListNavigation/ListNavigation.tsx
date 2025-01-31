import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import React, { type FC, type ReactNode } from 'react';

import styles from './ListNavigation.module.scss';
import { type ListNavigationItem, type ListNavigationProps, ListNavigationType } from './ListNavigation.types';

const ListNavigation: FC<ListNavigationProps> = ({
	listItems,
	className,
	color = 'white',
	onClick,
	type = ListNavigationType.Navigation,
}) => {
	const nodeProps = (layer: number) => ({
		buttonClassName: styles['c-list-navigation__button'],
		linkClassName:
			type === ListNavigationType.Navigation
				? clsx(
						styles['c-list-navigation__link'],
						styles[`c-list-navigation__link--indent--${layer}`]
				  )
				: styles['c-list-navigation__link--simple'],
	});

	const renderChildrenRecursively = (items: ListNavigationItem[], layer = 0): ReactNode => {
		return (
			<ul className={clsx(styles['c-list-navigation__list'])}>
				{items.map((item) => {
					return (
						<li key={`list-nav-item-${item.id}`} onClick={() => onClick?.(item.id)} onKeyUp={(evt) => {
							if (evt.key === 'Enter') {
								onClick?.(item.id);
							}
						}}>
							{item.hasDivider && (
								<div className={styles['c-list-navigation__divider']} />
							)}
							<div
								className={clsx(
									styles['c-list-navigation__item'],
									// Only make leaf items active, never group items that have children
									item.active &&
										isEmpty(item.children) &&
										styles['c-list-navigation__item--active'],
									(item.variants || []).map((variant) => styles[variant])
								)}
							>
								<div>
									{typeof item.node === 'function'
										? item.node(nodeProps(layer))
										: item.node}
								</div>
							</div>
							{!isEmpty(item.children) &&
								!isNil(item.children) &&
								renderChildrenRecursively(item.children, layer + 1)}
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
