import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Icon from './Icon';
import { IconNamesLight, IconNamesSolid } from './Icon.const';

export default {
	title: 'Components/Icon',
	component: Icon,
} as ComponentMeta<typeof Icon>;

const AllIconsTemplate: ComponentStory<any> = () => (
	<>
		{[...Object.values(IconNamesLight), ...Object.values(IconNamesSolid)].map(
			(iconName: IconNamesLight | IconNamesSolid) => (
				<div
					style={{ display: 'inline-flex', alignItems: 'center', width: '30rem' }}
					key={'all_icons_' + iconName}
				>
					<Icon
						name={iconName}
						style={{ width: '5rem', height: '5rem', fontSize: '5rem' }}
					/>
					{' ' + iconName}
				</div>
			)
		)}
	</>
);
const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const allIcons = AllIconsTemplate.bind({});

export const Light_icons = Template.bind({});
Light_icons.args = { name: IconNamesLight.Trash };
Light_icons.argTypes = {
	name: {
		options: IconNamesLight,
		control: { type: 'select' },
	},
};

export const Solid_icons = Template.bind({});
Solid_icons.args = { name: IconNamesSolid.Trash };
Solid_icons.argTypes = {
	name: {
		options: IconNamesSolid,
		control: { type: 'select' },
	},
};
