import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import styles from '../ListNavigation.module.scss';
import type { ListNavigationItem, ListNavigationProps } from '../ListNavigation.types';

const renderLink = ({ to = '#', label = 'link', external = false }) => {
	return (
		<Link
			href={to}
			className={clsx(styles['c-list-navigation__link'])}
			target={external ? '_blank' : '_self'}
		>
			{label}
		</Link>
	);
};

const renderButton = ({
	onClick = () => null,
	icon = <Icon name={IconNamesLight.Plus} />,
	label = 'voeg nieuwe map toe',
}) => {
	return (
		<Button
			className={styles['c-list-navigation__button']}
			onClick={onClick}
			iconStart={icon}
			variants={['text']}
			label={label}
		/>
	);
};

export const mockListNavigationItem = ({
	node = 'mock item',
	id = 'mock item',
	active = true,
	hasDivider = false,
	children = [],
}: Partial<ListNavigationItem> = {}): ListNavigationItem[] => [
	{
		node: node,
		id: id,
		active: active,
		hasDivider: hasDivider,
		children: children,
	},
];

export const mockListNavigationItemWithoutChildren = ({
	node = 'mock item',
	id = 'mock item',
	active = true,
	hasDivider = false,
}: Partial<ListNavigationItem> = {}): ListNavigationItem[] => [
	{
		node: node,
		id: id,
		active: active,
		hasDivider: hasDivider,
	},
];

export const primaryListNavigationMock: ListNavigationProps = {
	listItems: [
		{
			node: renderLink({ label: 'bezoekersruimtesbeheer' }),
			id: 'bezoekersruimtesbeheer',
		},
		{
			node: renderLink({ label: 'Gebruikersbeheer' }),
			id: 'gebruikersbeheer',
			children: [
				{
					node: renderLink({ label: 'Gebruikers' }),
					id: 'gebruikers',
					active: true,
				},
				{
					node: renderLink({ label: 'Groepen en permissies' }),
					id: 'groepen en permissies',
				},
			],
		},
		{
			node: renderLink({ label: 'Navigatie' }),
			id: 'navigatie',
		},
		{
			node: renderLink({ label: 'Vertalingen' }),
			id: 'vertalingen',
		},
		{
			node: renderLink({ label: "Contentpagina's" }),
			id: "contentpagina's",
		},
	],
};

export const secondaryListNavigationMock: ListNavigationProps = {
	listItems: [
		{
			node: renderLink({ label: 'Favorieten' }),
			id: 'favorieten',
			active: true,
		},
		{
			node: renderLink({ label: 'Onderzoek Wereldoorlogen' }),
			id: 'onderzoek Wereldoorlogen',
		},
		{
			node: renderLink({ label: "Jaren '80" }),
			id: "jaren '80",
		},
		{
			node: renderLink({ label: '1000 Zonnen' }),
			id: '1000 Zonnen',
		},
		{
			node: renderLink({ label: 'De kampioenen' }),
			id: 'de kampioenen',
		},
		{
			node: renderButton({}),
			id: 'nieuwe map toevoegen',
			hasDivider: true,
		},
	],
	color: 'platinum',
};
