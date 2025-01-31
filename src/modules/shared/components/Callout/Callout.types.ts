import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface CalloutProps extends DefaultComponentProps {
	children?: ReactNode;
	icon?: ReactNode;
	text: string | ReactNode;
	action?: ReactNode;
}
