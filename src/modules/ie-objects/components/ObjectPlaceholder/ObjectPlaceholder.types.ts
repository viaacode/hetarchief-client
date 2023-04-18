import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ObjectPlaceholderProps extends DefaultComponentProps {
	description?: ReactNode;
	reasonTitle?: string;
	reasonDescription?: ReactNode;
	openModalButtonLabel?: string;
	closeModalButtonLabel?: string;
	small?: boolean;
	onOpenRequestAccess?: () => void;
}
