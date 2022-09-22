import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface CalloutProps extends DefaultComponentProps {
	icon?: ReactNode;
	text: string | ReactNode;
	action?: ReactNode;
}
