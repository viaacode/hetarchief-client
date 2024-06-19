import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import { type ToggleProps } from '../Toggle.types';

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
	onChange: (id) => console.info(id),
};
