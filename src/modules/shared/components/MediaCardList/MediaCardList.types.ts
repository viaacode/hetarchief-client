import { MediaCardProps } from '../MediaCard/MediaCard.types';

export interface MediaCardListProps extends Pick<MediaCardProps, 'view'> {
	items?: MediaCardProps[];
}
