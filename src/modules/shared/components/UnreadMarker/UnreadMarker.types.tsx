import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface UnreadMarkerProps extends DefaultComponentProps {
	children?: ReactNode;
	active?: boolean;
}
