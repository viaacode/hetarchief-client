import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface UnreadMarkerProps extends DefaultComponentProps {
	children?: ReactNode;
	active?: boolean;
}
