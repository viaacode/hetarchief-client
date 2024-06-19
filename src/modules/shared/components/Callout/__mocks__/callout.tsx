import { Button } from '@meemoo/react-components';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import { type CalloutProps } from '../Callout.types';

export const calloutMock: CalloutProps = {
	icon: <Icon name={IconNamesLight.Info} />,
	text: 'This is a callout',
	action: <Button />,
};
