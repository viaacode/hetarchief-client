import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import Modal from './Modal';

export default {
	title: 'Components/Modal',
	component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
	const [isOpen, setOpen] = useState(false);

	return (
		<div style={{ background: 'hotpink', width: '100vw', height: '100vh' }}>
			<pre style={{ margin: 0 }} onClick={() => setOpen(true)}>
				{JSON.stringify({ clickHereToToggle: isOpen }, null, 2)}
			</pre>

			<Modal
				{...args}
				onClose={() => {
					args.onClose && args.onClose();
					setOpen(false);
				}}
				isOpen={isOpen}
			/>
		</div>
	);
};

export const Primary: ComponentStory<typeof Modal> = Template.bind({});
Primary.args = {
	title: 'The quick brown fox jumps over the lazy dog',
	children: (
		<>
			<div style={{ padding: '32px' }}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consectetur,
					leo vitae mattis sodales, eros erat fermentum nisl, quis bibendum dui nibh ut
					ligula. Duis tempus elit quis augue interdum, at dictum mi auctor. Nunc lobortis
					lacus in eleifend aliquam. Cras non maximus nibh, sit amet rutrum dolor. Nunc
					ultrices augue ac felis imperdiet commodo. Nunc eu lacinia augue. Interdum et
					malesuada fames ac ante ipsum primis in faucibus. Vestibulum ultrices sem vitae
					vulputate cursus. Nunc vitae nisl pharetra, volutpat tellus non, elementum ante.
					Integer tempus aliquam lorem. Nulla vel dolor orci. Nullam id leo eu massa
					semper mattis.
				</p>

				<p>
					Curabitur vitae molestie nisi, congue condimentum ante. Nam non molestie augue,
					a vehicula elit. Integer sollicitudin odio sit amet eleifend bibendum. Duis
					convallis orci quis enim condimentum posuere. Ut ut tortor euismod, convallis
					leo eget, tristique nunc. Phasellus vitae justo ipsum. Sed malesuada, leo nec
					ultrices porta, orci massa iaculis ligula, ac luctus ligula velit at nibh.
					Vestibulum tempus mollis efficitur. Praesent malesuada dictum neque, interdum
					fringilla nisi. Orci varius natoque penatibus et magnis dis parturient montes,
					nascetur ridiculus mus.{' '}
				</p>

				<button>A dynamic button</button>
			</div>
		</>
	),
};
