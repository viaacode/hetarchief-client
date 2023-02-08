import { IconNamesLight } from '@shared/components/Icon';

import { ToggleProps } from '../Toggle.types';

export const toggleMock: ToggleProps = {
	options: [
		{
			id: 'grid',
			iconName: IconNamesLight.GridView,
			active: true,
		},
		{
			id: 'list',
			iconName: IconNamesLight.ListView,
			active: false,
		},
	],
	onChange: (id) => console.log(id),
};
