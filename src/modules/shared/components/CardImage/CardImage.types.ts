import { DefaultComponentProps } from '@shared/types';

export interface CardImageProps extends DefaultComponentProps {
	color?: string;
	image?: string;
	logo?: string;
	name: string;
	id: string;
	size?: 'short' | 'tall' | 'small';
	shadow?: boolean;
}
