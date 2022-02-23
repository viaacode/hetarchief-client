import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import Link from 'next/link';

import { Icon } from '../../Icon';
import styles from '../ListNavigation.module.scss';
import { ListNavigationItem, ListNavigationProps } from '../ListNavigation.types';

const renderLink = ({ to = '#', label = 'link', external = false }) => {
	return (
		<Link href={to}>
			<a
				className={clsx(styles['c-list-navigation__link'])}
				target={external ? '_blank' : '_self'}
				role="link"
			>
				{label}
			</a>
		</Link>
	);
};

const renderButton = ({
	onClick = () => null,
	icon = <Icon name="plus" />,
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

export const primaryListNavigationMock: ListNavigationProps = {
	listItems: [
		{
			node: renderLink({ label: 'Leeszalenbeheer' }),
			id: 'leeszalenbeheer',
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
