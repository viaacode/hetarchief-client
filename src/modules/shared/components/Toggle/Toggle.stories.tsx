import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { cloneElement, ReactElement, useState } from 'react';

import Toggle from './Toggle';
import { ToggleOptions } from './Toggle.types';
import { toggleMock } from './__mocks__';

const ToggleStoryComponent = ({
	children,
	initialOptions = toggleMock.options,
}: {
	children: ReactElement;
	initialOptions?: ToggleOptions[];
}) => {
	const [options, setOptions] = useState(initialOptions);

	const handleChange = (id: string) => {
		action('option changed')(id);

		const newOptions = options.map((option) => {
			return {
				...option,
				active: option.id === id,
			};
		});
		setOptions(newOptions);
	};

	return cloneElement(children, {
		options,
		onChange: handleChange,
	});
};

export default {
	title: 'Components/Toggle',
	component: Toggle,
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => (
	<ToggleStoryComponent>
		<Toggle {...args} />
	</ToggleStoryComponent>
);

export const Default = Template.bind({});
Default.args = {};

export const Bordered = Template.bind({});
Bordered.args = {
	bordered: true,
};

export const Dark = Template.bind({});
Dark.args = {
	dark: true,
};
