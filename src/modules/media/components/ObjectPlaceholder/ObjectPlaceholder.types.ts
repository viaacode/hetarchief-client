import { DefaultComponentProps } from '@shared/types';

export interface ObjectPlaceholderProps extends DefaultComponentProps {
	description?: string;
	reasonTitle?: string;
	reasonDescription?: string;
	openModalButtonLabel?: string;
	closeModalButtonLabel?: string;
	small?: boolean;
}
