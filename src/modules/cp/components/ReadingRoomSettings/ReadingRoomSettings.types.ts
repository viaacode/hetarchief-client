import { VisitorSpaceInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomSettingsProps extends DefaultComponentProps {
	room: Pick<
		VisitorSpaceInfo,
		'id' | 'color' | 'image' | 'description' | 'serviceDescription' | 'logo' | 'name' | 'slug'
	>;
	refetch?: () => void;
	action?: 'edit' | 'create';
}
