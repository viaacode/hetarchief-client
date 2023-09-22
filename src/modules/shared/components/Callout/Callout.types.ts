import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface CalloutProps extends DefaultComponentProps {
	children?: React.ReactNode;
	icon?: ReactNode;
	text: string | ReactNode;
	action?: ReactNode;
}
