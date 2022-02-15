import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomImageProps extends DefaultComponentProps {
	color?: string;
	image?: string;
	name?: string;
	logo?: string;
	variant?: 'tall' | 'small' | 'short';
}
