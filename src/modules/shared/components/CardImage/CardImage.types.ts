import { DefaultComponentProps } from '@shared/types';

export interface CardImageProps extends DefaultComponentProps {
	color?: string | null;
	image?: string | null;
	logo?: string | null;
	name?: string;
	id: string;
	size?: 'short' | 'tall' | 'small';
	shadow?: boolean;
}
