import { ReadingRoomStatus } from '@reading-room/types';
import { BladeProps, ReadingRoom } from '@shared/components';

export interface RequestDetailBladeProps extends Pick<BladeProps, 'isOpen' | 'title' | 'onClose'> {
	roomData?: ReadingRoom | null;
	type?: `${ReadingRoomStatus}`;
	onConfirm?: () => void;
}
