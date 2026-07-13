import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { metadataMock } from './__mocks__/metadata';
import Metadata from './Metadata';

export default {
	title: 'Components/Metadata',
	component: Metadata,
} as Meta<typeof Metadata>;

const Template: StoryFn<typeof MetadataList> = (args) => (
	<MetadataList {...args}>
		{metadataMock.map((item, index) => {
			return (
				<Metadata
					title={item.title}
					key={`metadata-item-${typeof item.title === 'string' ? item.title : index}`}
				>
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
