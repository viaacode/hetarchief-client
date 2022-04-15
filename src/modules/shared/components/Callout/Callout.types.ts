import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface CalloutProps extends DefaultComponentProps {
	icon?: ReactNode;
	text: string;
	action?: CalloutAction;
}

export interface CalloutAction {
	label: string;
	onClick: () => void;
}
