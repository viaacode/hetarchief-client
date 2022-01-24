import { DefaultComponentProps } from '@shared/types';

export interface BladeProps extends DefaultComponentProps {
	title?: string;
	heading?: JSX.Element;
	footer?: JSX.Element;
	isOpen: boolean;
	hideOverlay?: boolean;
	hideCloseButton?: boolean;
	onClose?: () => void;
	// manager types
	layer?: number;
	isManaged?: boolean;
	currentLayer?: number;
}
