import { Button } from '@meemoo/react-components';

import { Icon, IconNamesLight } from '@shared/components/Icon';

import { CalloutProps } from '../Callout.types';

export const calloutMock: CalloutProps = {
	icon: <Icon name={IconNamesLight.Info} />,
	text: 'This is a callout',
	action: <Button />,
};
