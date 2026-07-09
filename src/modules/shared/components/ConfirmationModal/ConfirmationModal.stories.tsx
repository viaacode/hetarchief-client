import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import ConfirmationModal from './ConfirmationModal';

export default {
	title: 'Components/ConfirmationModal',
	component: ConfirmationModal,
} as Meta<typeof ConfirmationModal>;

const Template: StoryFn<typeof ConfirmationModal> = (args) => {
	const [isOpen, setOpen] = useState(false);

	return (
		<div>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: storybook */}
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

export const Primary: StoryFn<typeof ConfirmationModal> = Template.bind({});
