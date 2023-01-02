import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface ObjectPlaceholderProps extends DefaultComponentProps {
	description?: string | ReactNode;
	reasonTitle?: string;
	reasonDescription?: string | ReactNode;
	openModalButtonLabel?: string;
	closeModalButtonLabel?: string;
	small?: boolean;
}
