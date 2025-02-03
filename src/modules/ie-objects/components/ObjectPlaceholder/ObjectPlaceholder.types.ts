import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface ObjectPlaceholderProps extends DefaultComponentProps {
	children?: ReactNode;
	description?: ReactNode;
	reasonTitle?: string;
	reasonDescription?: ReactNode;
	openModalButtonLabel?: string;
	closeModalButtonLabel?: string;
	small?: boolean;
	onOpenRequestAccess?: () => void;
	addSliderPadding?: boolean;
}
