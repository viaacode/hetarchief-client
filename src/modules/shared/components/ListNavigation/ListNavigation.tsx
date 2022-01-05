import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, Fragment } from 'react';

import styles from './ListNavigation.module.scss';
import {
	ListNavigationButton,
	ListNavigationLink,
	ListNavigationListItem,
	ListNavigationProps,
} from './ListNavigation.types';

const ListNavigation: FC<ListNavigationProps> = ({ listItems }) => {
	const isLink = (item: ListNavigationListItem): item is ListNavigationLink => {
		return (item as ListNavigationLink).to !== undefined;
	};

	const renderLink = (link: ListNavigationLink) => {
		return (
			<Link href={link.to}>
				<a
					className={clsx(
						styles['c-list-navigation__link'],
						link.active && styles['c-list-navigation__link--active']
					)}
					target={link.external ? '_blank' : '_self'}
				>
					{link.label}
				</a>
			</Link>
		);
	};

	const renderButton = (button: ListNavigationButton) => {
		return (
			<Button
				className={styles['c-list-navigation__button']}
				onClick={button.onClick}
				iconStart={button.icon}
				variants={['text']}
				label={button.label}
			/>
		);
	};

	const renderdivider = () => {
		return <div className={styles['c-list-navigation__divider']} />;
	};

	const renderItems = (items: ListNavigationListItem[]) => {
		return (
			<ul className={styles['c-list-navigation__list']}>
				{items.map((item: ListNavigationListItem, index) => {
					if (isLink(item)) {
						return (
							<li
								className={styles['c-list-navigation__list-item']}
								key={`list-item-${index}`}
							>
								{renderLink(item)}
							</li>
						);
					} else {
						return (
							<li
								className={styles['c-list-navigation__list-item']}
								key={`list-item-${index}`}
							>
								{renderButton(item as ListNavigationButton)}
							</li>
						);
					}
				})}
			</ul>
		);
	};

	const renderArrays = (
		listItemsArray: ListNavigationListItem[] | ListNavigationListItem[][]
	) => {
		if (Array.isArray(listItemsArray[0])) {
			return (listItemsArray as ListNavigationListItem[][]).map((array, index) => {
				return (
					<Fragment key={`list-${index}`}>
						{renderItems(array)}
						{index < listItemsArray.length - 1 && renderdivider()}
					</Fragment>
				);
			});
		}
		return renderItems(listItemsArray as ListNavigationListItem[]);
	};
	return <Fragment>{renderArrays(listItems)}</Fragment>;
};

export default ListNavigation;
