import { Button } from '@meemoo/react-components';

import { type BladeProps } from '../Blade.types';

export const mockBladeProps: BladeProps = {
	renderTitle: () => 'Vraag toegang aan',
	isOpen: false,
	footer: (
		<div style={{ padding: '3.2rem' }}>
			<Button label="continue" variants="block" />
		</div>
	),
	id: 'mock-blade',
};
