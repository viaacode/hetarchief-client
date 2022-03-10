import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import ConfirmationModal from './ConfirmationModal';

export default {
	title: 'Components/ConfirmationModal',
	component: ConfirmationModal,
} as ComponentMeta<typeof ConfirmationModal>;

const Template: ComponentStory<typeof ConfirmationModal> = (args) => {
	const [isOpen, setOpen] = useState(false);

	return (
		<div>
			<pre style={{ margin: 0 }} onClick={() => setOpen(true)}>
				{JSON.stringify({ clickHereToToggle: isOpen }, null, 2)}
			</pre>

			<ConfirmationModal
				{...args}
				isOpen={isOpen}
				onCancel={() => setOpen(false)}
				onConfirm={() => setOpen(false)}
			/>
		</div>
	);
};

export const Primary: ComponentStory<typeof ConfirmationModal> = Template.bind({});
