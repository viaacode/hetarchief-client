import { Button } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import { Blade } from '@shared/components/Blade/Blade';

import BladeManager from './BladeManager';

const BladeManagerStoryComponent = () => {
	const [currentBlade, setCurrentBlade] = useState(0);

	const close = (layer: number) => {
		action('close layer ' + layer)();
		setCurrentBlade(layer - 1);
	};

	return (
		<>
			<Button label="Open first blade" onClick={() => setCurrentBlade(1)} />
			<BladeManager currentLayer={currentBlade} onCloseBlade={close}>
				<Blade isOpen={false} renderTitle={() => 'Blade 1'} layer={1} id="blade1">
					<Button label="Open second blade" onClick={() => setCurrentBlade(2)} />
				</Blade>
				<Blade isOpen={false} renderTitle={() => 'Blade 1'} layer={2} id="blade2">
					<Button label="Open third blade" onClick={() => setCurrentBlade(3)} />
				</Blade>
				<Blade isOpen={false} renderTitle={() => 'Blade 1'} layer={3} id="blade3" />
			</BladeManager>
		</>
	);
};

export default {
	title: 'Components/BladeManager',
	component: BladeManager,
} as ComponentMeta<typeof BladeManager>;

const Template: ComponentStory<typeof BladeManager> = () => <BladeManagerStoryComponent />;

export const Default = Template.bind({});
