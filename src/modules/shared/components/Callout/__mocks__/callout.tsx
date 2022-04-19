import { Icon } from '@shared/components/Icon';

import { CalloutProps } from '../Callout.types';

export const calloutMock: CalloutProps = {
	icon: <Icon name="info" />,
	text: 'This is a callout',
	action: {
		label: 'button',
		onClick: () => null,
	},
};
