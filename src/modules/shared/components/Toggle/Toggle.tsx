import { Button } from '@meemoo/react-components';
import { FC } from 'react';

import { ToggleProps } from './Toggle.types';

const Toggle: FC<ToggleProps> = () => {
	return (
		<div>
			<Button label="grid" />
			<Button label="list" />
		</div>
	);
};

export default Toggle;
