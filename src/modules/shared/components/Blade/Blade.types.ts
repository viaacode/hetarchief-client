import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface BladeProps extends DefaultComponentProps {
	children?: ReactNode;
	footer?: ReactNode;
	isOpen: boolean;
	hideOverlay?: boolean;
	hideCloseButton?: boolean;
	showCloseButtonOnTop?: boolean;
	showBackButton?: boolean;
	onClose?: () => void;
	// manager types
	layer?: number;
	isManaged?: boolean;
	currentLayer?: number;
	renderTitle?: (props: Pick<HTMLElement, 'id' | 'className'>) => ReactNode;
	id: string;
}
