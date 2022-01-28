import { Pagination } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { cloneElement, ReactElement, useState } from 'react';

import { Icon, IconLightNames } from '../Icon';

const PaginationStoryComponent = ({
	children,
	initialPageIndex = 0,
}: {
	children: ReactElement;
	initialPageIndex?: number;
}) => {
	const [currentPage, setCurrentPage] = useState(initialPageIndex);

	return cloneElement(children, {
		currentPage,
		onPageChange: (index: number) => {
			action('page changed')(index);
			setCurrentPage(index);
		},
	});
};

const renderButton = (icon: IconLightNames, label: string, layout: 'left' | 'right') => (
	<>
		{layout === 'left' && <span>{label}</span>}
		<Icon className="c-pagination__icon" name={icon} />
		{layout === 'right' && <span>{label}</span>}
	</>
);

export default {
	title: 'Components/Pagination',
	component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => (
	<PaginationStoryComponent>
		<Pagination {...args} />
	</PaginationStoryComponent>
);

export const Default = Template.bind({});
Default.args = {
	pageCount: 5,
	displayCount: 5,
	currentPage: 0,
	onPageChange: (page: number) => action(`page index is ${page}`),
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};

export const WithFirstLastNumbers = Template.bind({});
WithFirstLastNumbers.args = {
	pageCount: 9,
	displayCount: 5,
	currentPage: 0,
	onPageChange: (page: number) => action(`page index is ${page}`),
	showFirstLastNumbers: true,
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};
