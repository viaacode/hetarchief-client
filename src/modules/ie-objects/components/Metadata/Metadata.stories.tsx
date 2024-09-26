import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import MetadataList from '@ie-objects/components/Metadata/MetadataList';

import Metadata from './Metadata';
import { metadataMock } from './__mocks__/metadata';

export default {
	title: 'Components/Metadata',
	component: Metadata,
} as ComponentMeta<typeof Metadata>;

const Template: ComponentStory<typeof MetadataList> = (args) => (
	<MetadataList {...args}>
		{metadataMock.map((item, index) => {
			return (
				<Metadata title={item.title} key={`metadata-item-${index}`}>
					{item.data}
				</Metadata>
			);
		})}
	</MetadataList>
);

export const Default = Template.bind({});
Default.args = { allowTwoColumns: true };

export const Wide = Template.bind({});
Wide.args = { allowTwoColumns: false };
