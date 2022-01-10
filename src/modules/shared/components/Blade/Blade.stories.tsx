import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import Blade from './Blade';

import { BladeProps } from '.';

const BladeStoryComponent = ({ args }: { args: BladeProps }) => {
	const [isOpen, setOpen] = useState(false);

	const open = () => {
		action('onOpen')();
		setOpen(true);
	};

	const close = () => {
		action('onClose')();
		setOpen(false);
	};

	return (
		<>
			<div>
				<h1>Title</h1>
				<p>Some content</p>
				<button onClick={open}>open modal</button>
			</div>
			<Blade {...args} onClose={close} isOpen={isOpen} />
		</>
	);
};

export default {
	title: 'Components/Blade',
	component: Blade,
} as ComponentMeta<typeof Blade>;

const Template: ComponentStory<typeof Blade> = (args) => <BladeStoryComponent args={args} />;

export const Default = Template.bind({});
Default.args = {
	title: 'title',
	children: <div>hey</div>,
	footer: <div>button</div>,
};
