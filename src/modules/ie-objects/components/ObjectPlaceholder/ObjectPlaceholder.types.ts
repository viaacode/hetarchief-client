import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ObjectPlaceholderProps extends DefaultComponentProps {
	children?: React.ReactNode;
	description?: ReactNode;
	reasonTitle?: string;
	reasonDescription?: ReactNode;
	openModalButtonLabel?: string;
	closeModalButtonLabel?: string;
	small?: boolean;
	onOpenRequestAccess?: () => void;
	addSliderPadding?: boolean;
}
