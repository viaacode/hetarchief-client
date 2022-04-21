import { VisitorSpaceInfo } from '@reading-room/types';
import { DefaultComponentProps } from '@shared/types';

export interface ReadingRoomSettingsProps extends DefaultComponentProps {
	room: VisitorSpaceInfo;
	refetch: () => void;
}
